package main

import (
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (app *App) OpenHome(_ *menu.CallbackData) {
	//app.WindowReload()
	runtime.EventsEmit(app.ctx, "navigate", "/")

}

func (app *App) OpenAbout(_ *menu.CallbackData) {
	runtime.EventsEmit(app.ctx, "navigate", "/about")
}

func (app *App) OpenDevices(_ *menu.CallbackData) {
	runtime.EventsEmit(app.ctx, "navigate", "/configuration")
}

func (app *App) OpenMonitor(_ *menu.CallbackData) {
	runtime.EventsEmit(app.ctx, "navigate", "/monitor")
}

func (app *App) ConnectDevices(_ *menu.CallbackData) {
	runtime.EventsEmit(app.ctx, "navigate", "/connect")
}
