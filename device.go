package main

import (
	"time"

	"gorm.io/gorm"
)

type Device struct {
	db *gorm.DB
	gorm.Model
	Id            int64  `json:"id"`
	DeviceType    string `json:"deviceType"`
	DeviceName    string `json:"deviceName"`
	DeviceIP      string `json:"deviceIP"`
	DeviceIPPort  string `json:"deviceIPPort"`
	DeviceURL     string `json:"deviceURL"`
	DeviceURLPort string `json:"deviceURLPort"`
	CreatedAt     *time.Time
	UpdatedAt     *time.Time
}

type DeviceContextKey string

const (
	NewDeviceContextKey DeviceContextKey = "DeviceKey"
)

func NewDevice() *Device {
	db := InitDb()
	db.AutoMigrate(&Device{})
	return &Device{db: db}
}

func (device *Device) AddDevice(deviceType string, deviceName string, deviceIP string, deviceIPPort string, deviceURL string, deviceURLPort string) error {
	result := device.db.Create(&Device{
		DeviceType:    deviceType,
		DeviceName:    deviceName,
		DeviceIP:      deviceIP,
		DeviceIPPort:  deviceIPPort,
		DeviceURL:     deviceURL,
		DeviceURLPort: deviceURLPort,
	})
	if result.Error != nil {
		return result.Error
	} else {
		return nil
	}
}

func (device *Device) GetDevices() ([]Device, error) {
	var devices []Device
	result := device.db.Find(&devices)
	if result.Error != nil {
		return nil, result.Error
	} else {
		return devices, nil
	}
}

func (device *Device) DeleteDevice(id int64) {
	device.db.Delete(&Device{Id: id})
}
