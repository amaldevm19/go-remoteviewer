package main

import (
	"context"
	"fmt"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx     context.Context
	monitor *Monitor // Add a Monitor instance to the App struct
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		monitor: NewMonitor(), // Initialize the Monitor instance here
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) domReady(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.monitor.ctx = ctx            // Pass the context to Monitor
	a.monitor.StartAllMonitoring() // Call StartMonitoring on the Monitor instance
}

func (a *App) OnBeforeClose(ctx context.Context) (prevent bool) {

	dialog, err := runtime.MessageDialog(ctx, runtime.MessageDialogOptions{
		Type:    runtime.QuestionDialog,
		Title:   "Quit?",
		Message: "Are you sure you want to quit?",
	})

	if err == nil && dialog == "Yes" {
		// Stop all active monitoring and reset the IsMonitoring status before shutdown
		a.monitor.StopAllMonitoring()
	}
	return dialog != "Yes"

}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) WindowReload() {
	runtime.WindowReloadApp(a.ctx)
}

func (app *App) OpenNewWindow() {

}
