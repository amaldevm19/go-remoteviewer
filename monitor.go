package main

import (
	"bufio"
	"context"
	"encoding/csv"
	"fmt"
	"os"
	"os/exec"
	"regexp"
	r "runtime"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	//"github.com/go-ping/ping"       // Add a ping library
	//"github.com/gosnmp/gosnmp"

	"github.com/gosnmp/gosnmp"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Monitor struct {
	ctx context.Context
	db  *gorm.DB
	gorm.Model
	Id                  string `json:"id"`                  // Unique identifier for the device
	Name                string `json:"name"`                // Name of the device
	IP                  string `json:"ip"`                  // IP address of the device
	PingEnabled         bool   `json:"ping"`                // Enable/Disable ping
	PingInterval        int    `json:"pingInterval"`        // Interval for ping in milliseconds
	PingRetryAttempts   int    `json:"pingRetryAttempts"`   // Number of retry attempts for ping
	PingTimeout         int    `json:"pingTimeout"`         // Timeout for ping in milliseconds
	SavePingResponse    string `json:"savePingResponse"`    // Where to save ping responses (db, file, none)
	PingSilent          bool   `json:"pingSilent"`          // Silent mode for ping (no console output)
	PingAlert           bool   `json:"pingAlert"`           // Alert on missing ping
	SNMPEnabled         bool   `json:"snmp"`                // Enable/Disable SNMP
	PollInterval        int    `json:"pollInterval"`        // Poll interval for SNMP in milliseconds
	OID                 string `json:"oid"`                 // Object Identifier for SNMP
	SNMPPort            int    `json:"snmpPort"`            // Port for SNMP (default 161)
	SNMPCommunity       string `json:"snmpCommunity"`       // Community string for SNMP
	SNMPMaxReps         int    `json:"snmpMaxReps"`         // Max repetitions for SNMP GetBulk
	SNMPVersion         string `json:"snmpVersion"`         // Version of SNMP (v1, v2c, v3)
	SaveSNMPResponse    string `json:"saveSNMPResponse"`    // Where to save SNMP responses (db, file, none)
	SNMPSilent          bool   `json:"snmpSilent"`          // Silent mode for SNMP (no console output)
	SNMPAlert           bool   `json:"snmpAlert"`           // Alert on missing SNMP response
	IsMonitoringEnabled bool   `json:"isMonitoringEnabled"` // Indicates if the device is currently being monitored
	IsMonitoring        bool   `json:"isMonitoring"`        // Indicates if the device is currently being monitored
	CreatedAt           *time.Time
	UpdatedAt           *time.Time
	// CancelFunc          context.CancelFunc `gorm:"-"` // Exclude from database
}

type MonitorContextKey string

type PingResult struct {
	DateTime     time.Time
	DeviceName   string
	IPAddress    string
	Status       string
	PacketsSent  int
	PacketsRecv  int
	PacketsLost  int
	ResponseTime string
}

type PingResponse struct {
	ID           uint      `gorm:"primarykey;autoIncrement"`
	DeviceId     string    `json:"device_id"`
	Name         string    `json:"device_name"` // Reference to the device being pinged
	IP           string    `json:"ip"`          // The IP address of the device
	Status       string    `json:"status"`      // "OK" or "NOT OK"
	PacketsSent  int       `json:"packets_sent"`
	PacketsRecv  int       `json:"packets_received"`
	PacketsLost  int       `json:"packets_lost"`
	ResponseTime string    `json:"response_time"`
	CreatedAt    time.Time `json:"created_at"`
}

type SNMPResponse struct {
	ID        uint      `gorm:"primarykey"`
	Name      string    `json:"device_name"`
	Date      string    `json:"date"`
	Time      string    `json:"time"`
	IPAddress string    `json:"ip_address"`
	OID       string    `json:"oid"`
	Value     string    `json:"value"`
	Status    string    `json:"status"` // OK or NOT OK
	CreatedAt time.Time `json:"created_at"`
}

const (
	NewMonitorContextKey MonitorContextKey = "DeviceKey"
)

func NewMonitor() *Monitor {

	db := InitDb()
	db.AutoMigrate(&Monitor{})
	db.AutoMigrate(&PingResponse{})
	return &Monitor{db: db}
}

func (monitor *Monitor) AddMonitor(
	name string,
	ip string,
	ping bool,
	pingInterval int,
	pingRetryAttempts int,
	pingTimeout int,
	savePingResponse string,
	pingSilent bool,
	pingAlert bool,
	snmp bool,
	pollInterval int,
	oid string,
	snmpPort int,
	snmpCommunity string,
	snmpMaxReps int,
	snmpVersion string,
	savesnmpResponse string,
	snmpSilent bool,
	snmpAlert bool,
	isMonitoringEnabled bool,
	isMonitoring bool,
) error {
	id := uuid.New().String()

	result := monitor.db.Create(&Monitor{
		Id:                  id, // Generate a unique ID
		Name:                name,
		IP:                  ip,
		PingEnabled:         ping,
		PingInterval:        pingInterval,
		PingRetryAttempts:   pingRetryAttempts,
		PingTimeout:         pingTimeout,
		SavePingResponse:    savePingResponse,
		PingSilent:          pingSilent,
		PingAlert:           pingAlert,
		SNMPEnabled:         snmp,
		PollInterval:        pollInterval,
		OID:                 oid,
		SNMPPort:            snmpPort,
		SNMPCommunity:       snmpCommunity,
		SNMPMaxReps:         snmpMaxReps,
		SNMPVersion:         snmpVersion,
		SaveSNMPResponse:    savesnmpResponse,
		SNMPSilent:          snmpSilent,
		SNMPAlert:           snmpAlert,
		IsMonitoringEnabled: isMonitoringEnabled,
		IsMonitoring:        isMonitoring,
	})
	if result.Error != nil {
		return result.Error
	} else {
		if isMonitoring {
			monitor.StartSingleMonitoring(id)
		}
		return nil
	}
}

func (m *Monitor) UpdateMonitor(
	id string,
	name string,
	ip string,
	ping bool,
	pingInterval int,
	pingRetryAttempts int,
	pingTimeout int,
	savePingResponse string,
	pingSilent bool,
	pingAlert bool,
	snmp bool,
	pollInterval int,
	oid string,
	snmpPort int,
	snmpCommunity string,
	snmpMaxReps int,
	snmpVersion string,
	savesnmpResponse string,
	snmpSilent bool,
	snmpAlert bool,
	isMonitoringEnabled bool,
	isMonitoring bool,
) error {
	var monitor Monitor

	// Find the existing monitor record by ID
	result := m.db.First(&monitor, "id = ?", id)
	if result.Error != nil {
		return result.Error // Return an error if the monitor is not found
	}

	monitor.Name = name
	monitor.IP = ip
	monitor.PingEnabled = ping
	monitor.PingInterval = pingInterval
	monitor.PingRetryAttempts = pingRetryAttempts
	monitor.PingTimeout = pingTimeout
	monitor.SavePingResponse = savePingResponse
	monitor.PingSilent = pingSilent
	monitor.PingAlert = pingAlert
	monitor.SNMPEnabled = snmp
	monitor.PollInterval = pollInterval
	monitor.OID = oid
	monitor.SNMPPort = snmpPort
	monitor.SNMPCommunity = snmpCommunity
	monitor.SNMPMaxReps = snmpMaxReps
	monitor.SNMPVersion = snmpVersion
	monitor.SaveSNMPResponse = savesnmpResponse
	monitor.SNMPSilent = snmpSilent
	monitor.SNMPAlert = snmpAlert
	monitor.IsMonitoringEnabled = isMonitoringEnabled
	monitor.IsMonitoring = isMonitoring

	// Save the updated monitor record back to the database
	if err := m.db.Save(&monitor).Error; err != nil {
		return err // Return an error if saving fails
	}

	if isMonitoringEnabled && isMonitoring {
		m.StartSingleMonitoring(id)
	} else {
		m.StopSingleMonitoring(id)
	}
	return nil // Return nil if the update is successful
}

func (monitor *Monitor) GetMonitors() ([]Monitor, error) {
	var monitors []Monitor
	result := monitor.db.Find(&monitors)
	if result.Error != nil {
		return nil, result.Error
	} else {
		return monitors, nil
	}
}

func (m *Monitor) GetSingleMonitorForEdit(id string) (Monitor, error) {
	var monitor Monitor
	result := m.db.First(&monitor, "id = ?", id)
	if result.Error != nil {
		return monitor, result.Error
	} else {
		return monitor, nil
	}
}

var cancelFunctions = make(map[string]context.CancelFunc)

func (monitor *Monitor) registerCancelFunction(id string, cancel context.CancelFunc) {
	cancelFunctions[id] = cancel
}

func (m *Monitor) DeleteMonitor(id string) {
	var monitor Monitor
	result := m.db.First(&monitor, "id = ?", id)
	if result.Error == nil && monitor.IsMonitoring {
		dialog, err := runtime.MessageDialog(m.ctx, runtime.MessageDialogOptions{
			Type:    runtime.QuestionDialog,
			Title:   "Delete?",
			Message: "Are you sure you want to Delete?",
		})

		if err == nil && dialog == "Yes" {
			// Stop all active monitoring and reset the IsMonitoring status before shutdown
			m.StopSingleMonitoring(id)
			m.db.Delete(&Monitor{Id: id})
		}

	} else {
		m.db.Delete(&Monitor{Id: id})
	}

}

// Start monitoring devices (Ping or SNMP)
func (m *Monitor) StartAllMonitoring() {
	var monitors []Monitor
	m.db.Find(&monitors)
	for i, monitor := range monitors {
		if monitor.IsMonitoringEnabled {
			monitorCtx, cancel := context.WithCancel(context.Background())
			m.registerCancelFunction(monitor.Id, cancel)
			monitors[i].IsMonitoring = true
			if monitor.PingEnabled {
				go m.startPingMonitoring(monitor, monitorCtx)

			}
			if monitor.SNMPEnabled {
				go m.startSNMPMonitoring(monitor, monitorCtx)
			}
			m.db.Save(&monitors[i])
		}
	}
}

// Stop all active monitoring and reset IsMonitoring to false
func (m *Monitor) StopAllMonitoring() {
	var monitors []Monitor
	m.db.Find(&monitors) // Retrieve all monitors

	for i, monitor := range monitors {
		if monitor.IsMonitoring {
			// Cancel the monitoring context for each device
			if monitors[i].IsMonitoring {
				cancelFunction, ok := cancelFunctions[monitors[i].Id]
				if ok {
					cancelFunction()
					delete(cancelFunctions, monitors[i].Id)
				}
			}

			// Set IsMonitoring to false
			monitors[i].IsMonitoring = false
			m.db.Save(&monitors[i]) // Save the updated status to the database
		}
	}
}

// Ping Monitoring Logic
func (m *Monitor) startPingMonitoring(monitor Monitor, ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			fmt.Printf("Stopped pinging device %s at IP: %s\n", monitor.Name, monitor.IP)
			runtime.EventsEmit(m.ctx, "PingStopped", "Ping monitoring has been stopped.")
			return
		default:
			// Simulate getting a ping response
			// pingResponse := fmt.Sprintf("Ping response from device %s at %v", monitor.Name, time.Now())
			// Set up the ping command (adjust for your OS)
			cmd := exec.Command("ping", monitor.IP, "-n", "1") // "-c 1" sends one packet (Linux/macOS)
			stdout, err := cmd.StdoutPipe()

			if err != nil {
				runtime.LogErrorf(m.ctx, "Error starting ping command: %v", err)
				return
			}
			if err := cmd.Start(); err != nil {
				runtime.LogErrorf(m.ctx, "Error starting ping command: %v", err)
				return
			}

			// Read the output of the ping command
			scanner := bufio.NewScanner(stdout)
			var response string
			var completeResponse string
			var isSuccess bool
			for scanner.Scan() {
				response = scanner.Text()
				// Check for success/failure based on command output
				if strings.Contains(response, "(0% loss)") {
					isSuccess = true
				} else if strings.Contains(response, "100% packet loss") || strings.Contains(response, "Destination Host Unreachable") || strings.Contains(response, "Packets: Sent = 1, Received = 0, Lost = 1 (100% loss)") {
					isSuccess = false
				}
				// Emit the ping response to the frontend
				completeResponse += fmt.Sprintf("%s ", response)
			}

			if isSuccess {
				message := fmt.Sprintf("Ping Response from Machine %s (%s) is Successful", monitor.Name, monitor.IP)

				runtime.EventsEmit(m.ctx, "response",
					map[string]string{
						"deviceId": monitor.Id,
						"status":   "OK",
						"response": message,
					})
			} else {
				message := fmt.Sprintf("Ping Response from Machine %s (%s) is Fail", monitor.Name, monitor.IP)
				runtime.EventsEmit(m.ctx, "response",
					map[string]string{
						"deviceId": monitor.Id,
						"status":   "NOT OK",
						"response": message,
					})
			}

			if err := cmd.Wait(); err != nil {
				runtime.LogErrorf(m.ctx, "Ping command failed: %v", err)
			}
			//fmt.Println()
			m.saveResponse(monitor, "ping", completeResponse)
			runtime.LogInfof(m.ctx, completeResponse)
			time.Sleep(time.Duration(monitor.PingInterval) * time.Millisecond)
		}
	}
}

// SNMP Monitoring Logic
func (m *Monitor) startSNMPMonitoring(monitor Monitor, ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			fmt.Printf("Stopped SNMP monitoring for device %s at IP: %s\n", monitor.Name, monitor.IP)
			if !monitor.SNMPSilent {
				runtime.EventsEmit(m.ctx, "response",
					map[string]string{
						"deviceId": monitor.Id,
						"status":   monitor.OID,
						"response": "SNMP monitoring has been stopped.",
					})
			}
			err := m.saveSNMPResponse(monitor, "null", fmt.Errorf("SNMP monitoring has been stopped"))
			if err != nil {
				runtime.LogErrorf(m.ctx, "Error in saving SNMP response for device %s: %v", monitor.Name, err)
			}
			return
		default:
			// Perform SNMP Get or GetBulk operation
			value, err := m.performSNMPGet(monitor)
			if err != nil {
				if monitor.SNMPAlert {
					fmt.Println("SNMP alert triggered!")
				}
			}

			if !monitor.SNMPSilent {
				runtime.EventsEmit(m.ctx, "response",
					map[string]string{
						"deviceId": monitor.Id,
						"status":   monitor.OID,
						"response": value,
					})
			}

			err = m.saveSNMPResponse(monitor, value, err)
			if err != nil {
				runtime.LogErrorf(m.ctx, "Error in saving SNMP response for device %s: %v", monitor.Name, err)
			}

			time.Sleep(time.Duration(monitor.PollInterval) * time.Millisecond)
		}
	}
}

// Function to perform SNMP Get request
func (m *Monitor) performSNMPGet(monitor Monitor) (string, error) {
	g := &gosnmp.GoSNMP{
		Target:    monitor.IP,
		Port:      uint16(monitor.SNMPPort),
		Community: monitor.SNMPCommunity,
		Version:   gosnmp.Version2c, // Adjust based on monitor.SNMPVersion
		Timeout:   time.Duration(2) * time.Second,
		Retries:   1,
	}
	err := g.Connect()
	if err != nil {
		return "null", fmt.Errorf("error connecting to SNMP device: %v", err)
	}
	defer g.Conn.Close()

	oids := []string{monitor.OID}
	result, err := g.Get(oids)
	if err != nil {
		return "null", fmt.Errorf("error performing SNMP get: %v", err)
	}
	var value string
	for _, variable := range result.Variables {
		// Handle the response based on the variable type

		switch variable.Type {
		case gosnmp.OctetString:
			value = string(variable.Value.([]byte))
		default:
			value = fmt.Sprintf("%v", variable.Value)
		}

	}

	return value, nil

}

// Save response to DB or file
func (m *Monitor) saveResponse(monitor Monitor, responseType string, completeResponse string) {
	pingResult, err := parsePingResult(completeResponse, monitor.Name)
	if err != nil {
		fmt.Println(err)
	}
	if responseType == "ping" {
		if monitor.SavePingResponse == "db" {
			// Save Ping response to DB
			m.savePingResponseToDb(pingResult, monitor)
		} else if monitor.SavePingResponse == "file" {
			// Save Ping response to file
			savePingResponseToCSV(pingResult)
		}
	}
}

// Start monitoring a single device (Ping or SNMP) when UI button start stop button is pressed;  we cannot use StartMonitoring() for start stop from UI button, because it will start all again
func (m *Monitor) StartSingleMonitoring(id string) {
	var monitor Monitor
	result := m.db.First(&monitor, "id = ?", id)
	_, ok := cancelFunctions[id]
	if result.Error == nil && !ok && monitor.IsMonitoringEnabled {
		monitorCtx, cancel := context.WithCancel(context.Background())
		m.registerCancelFunction(monitor.Id, cancel)
		if monitor.PingEnabled {
			go m.startPingMonitoring(monitor, monitorCtx)
		}
		if monitor.SNMPEnabled {
			go m.startSNMPMonitoring(monitor, monitorCtx)
		}

		monitor.IsMonitoring = true
		m.db.Save(&monitor) // Update DB to reflect started monitoring
	}
}

func (m *Monitor) StopSingleMonitoring(id string) {
	var monitor Monitor
	result := m.db.First(&monitor, "id = ?", id)
	if result.Error == nil && monitor.IsMonitoring {
		cancelFunction, ok := cancelFunctions[id]
		if ok {
			cancelFunction()
			delete(cancelFunctions, id)
		}
		monitor.IsMonitoring = false
		m.db.Save(&monitor) // Update DB to reflect stopped monitoring
	}

}

// Helper function to extract single value using multiple patterns
func extractWithMultiplePatterns(input string, patterns []string) string {
	for _, pattern := range patterns {
		re := regexp.MustCompile(pattern)
		matches := re.FindStringSubmatch(input)
		if len(matches) > 1 {
			return matches[1]
		}
	}
	return ""
}

// Helper function to extract multiple groups with multiple patterns
func extractMultipleGroups(input string, patterns []string, expectedGroupCount int) []string {
	for _, pattern := range patterns {
		re := regexp.MustCompile(pattern)
		matches := re.FindStringSubmatch(input)
		if len(matches) > expectedGroupCount {
			return matches[1 : expectedGroupCount+1] // Return only the expected groups
		}
	}
	return []string{}
}

func parsePingResult(pingResult string, deviceName string) (PingResult, error) {
	result := PingResult{
		DateTime:   time.Now(),
		DeviceName: deviceName,
	}

	// Handle different formats by using multiple regex patterns

	// IP Address
	ipPatterns := []string{
		`Pinging\s([\d\.]+)`, // Windows
		`PING\s([\d\.]+)`,    // Linux
	}
	result.IPAddress = extractWithMultiplePatterns(pingResult, ipPatterns)

	// Packets (Sent, Received, Lost)
	packetPatterns := []string{
		`Packets:\s+Sent\s=\s(\d+),\s+Received\s=\s(\d+),\s+Lost\s=\s(\d+)`,     // Windows
		`(\d+)\s+packets transmitted,\s+(\d+)\s+received,\s+(\d+)% packet loss`, // Linux
	}
	packetMatches := extractMultipleGroups(pingResult, packetPatterns, 3)
	if len(packetMatches) > 2 {
		result.PacketsSent, _ = strconv.Atoi(packetMatches[0])
		result.PacketsRecv, _ = strconv.Atoi(packetMatches[1])
		result.PacketsLost = result.PacketsSent - result.PacketsRecv
		if result.PacketsLost == 0 {
			result.Status = "Success"
		} else {
			result.Status = "Fail"
		}
	}

	// Response Time (Average)
	responsePatterns := []string{
		`Average\s=\s([\d]+)ms`, // Windows
		`rtt min/avg/max/mdev = [\d\.]+/([\d\.]+)/[\d\.]+/[\d\.]+\sms`, // Linux
	}
	result.ResponseTime = extractWithMultiplePatterns(pingResult, responsePatterns)

	return result, nil
}

func savePingResponseToCSV(pingResult PingResult) error {
	// Create the file name based on device name and response type (ping/snmp)
	fileName := fmt.Sprintf("%s_%s.csv", pingResult.DeviceName, "Ping")

	file, err := os.OpenFile(fileName, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	// Write the CSV headers if it's a new file
	fileInfo, _ := file.Stat()
	if fileInfo.Size() == 0 {
		headers := []string{"Date", "Time", "Device Name", "IP Address", "Status", "Sent", "Received", "Lost", "Response Time"}
		if err := writer.Write(headers); err != nil {
			return err
		}
	}

	// Append the ping result data
	record := []string{
		pingResult.DateTime.Format("2006-01-02"),
		pingResult.DateTime.Format("15:04:05"),
		pingResult.DeviceName,
		pingResult.IPAddress,
		pingResult.Status,
		strconv.Itoa(pingResult.PacketsSent),
		strconv.Itoa(pingResult.PacketsRecv),
		strconv.Itoa(pingResult.PacketsLost),
		pingResult.ResponseTime,
	}

	if err := writer.Write(record); err != nil {
		return err
	}

	return nil
}

func (m *Monitor) savePingResponseToDb(pingResult PingResult, monitor Monitor) error {
	pingResponse := PingResponse{
		DeviceId:     monitor.Id, // Device identifier
		Name:         monitor.Name,
		IP:           monitor.IP,        // Device IP address
		Status:       pingResult.Status, // "OK" or "NOT OK"
		PacketsSent:  pingResult.PacketsSent,
		PacketsRecv:  pingResult.PacketsRecv,
		PacketsLost:  pingResult.PacketsLost,
		ResponseTime: pingResult.ResponseTime,
		CreatedAt:    time.Now(), // Timestamp of the ping
	}

	result := m.db.Create(&pingResponse)
	if result.Error != nil {
		runtime.LogErrorf(m.ctx, "Error saving ping response to DB: %v", result.Error)
		return result.Error
	}

	runtime.LogInfof(m.ctx, "Ping response for device %s saved successfully", monitor.Name)
	return nil
}

func (m *Monitor) OpenCSVFile(filePath string) error {
	var cmd *exec.Cmd

	// Determine the operating system and set the command accordingly
	switch r.GOOS {
	case "windows":
		cmd = exec.Command("cmd", "/c", "start", "", filePath) // Use `cmd /c start` for Windows
	case "darwin":
		cmd = exec.Command("open", filePath) // Use `open` for macOS
	case "linux":
		cmd = exec.Command("xdg-open", filePath) // Use `xdg-open` for Linux
	default:
		return fmt.Errorf("unsupported platform: %s", r.GOOS)
	}

	// Start the command to open the file
	if err := cmd.Start(); err != nil {
		return fmt.Errorf("failed to open file: %v", err)
	}

	return nil
}

func (m *Monitor) saveSNMPResponse(monitor Monitor, value string, err error) error {
	var status string
	if err == nil {
		status = "OK"
	} else {
		status = fmt.Sprintf("%s", err)
	}
	var er error
	if monitor.SaveSNMPResponse == "db" {
		er = m.saveSNMPResponseToDb(monitor, value, status)
	} else if monitor.SaveSNMPResponse == "file" {
		er = m.saveSNMPResponseToFile(monitor, value, status)
	}
	return er
}

func (m *Monitor) saveSNMPResponseToDb(monitor Monitor, value string, status string) error {
	snmpResponse := SNMPResponse{
		Date:      time.Now().Format("02-01-2006"),
		Time:      time.Now().Format("15:04:05"),
		Name:      monitor.Name,
		IPAddress: monitor.IP,
		OID:       monitor.OID,
		Value:     value,
		Status:    status,
		CreatedAt: time.Now(),
	}

	result := m.db.Create(&snmpResponse)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (m *Monitor) saveSNMPResponseToFile(monitor Monitor, value string, status string) error {

	fileName := fmt.Sprintf("%s_snmp_log.csv", monitor.Name)
	fileExists := true
	if _, err := os.Stat(fileName); os.IsNotExist(err) {
		fileExists = false
	}

	file, err := os.OpenFile(fileName, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return fmt.Errorf("error opening CSV file: %v", err)
	}
	defer file.Close()

	csvWriter := csv.NewWriter(file)
	defer csvWriter.Flush()

	// Write headers if the file is new
	if !fileExists {
		headers := []string{"Date", "Time", "Device Name", "IP Address", "OID", "Response Value", "Status"}
		if err := csvWriter.Write(headers); err != nil {
			return fmt.Errorf("error writing Header to CSV file: %v", err)
		}
	}

	// Write the SNMP response data
	record := []string{
		time.Now().Format("02-01-2006"),
		time.Now().Format("15:04:05"),
		monitor.Name,
		monitor.IP,
		monitor.OID,
		value,
		status,
	}

	if err := csvWriter.Write(record); err != nil {
		return fmt.Errorf("error writing to CSV file: %v", err)
	}
	return nil
}
