package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/menu/keys"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()
	todo := NewTodo()
	device := NewDevice()

	Menu := menu.NewMenu()

	AppMenu := Menu.AddSubmenu("Apps")
	AppMenu.AddText("Home", keys.CmdOrCtrl("h"), app.OpenHome)
	AppMenu.AddText("About", keys.CmdOrCtrl("a"), app.OpenAbout)

	ConfigMenu := Menu.AddSubmenu("Configuration")
	ConfigMenu.AddText("Devices", keys.CmdOrCtrl("n"), app.OpenDevices)
	ConfigMenu.AddText("Monitor", keys.CmdOrCtrl("m"), app.OpenMonitor)

	ConnectMenu := Menu.AddSubmenu("Connect")
	ConnectMenu.AddText("Devices", keys.CmdOrCtrl("n"), app.ConnectDevices)

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "Remote Viewer",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		OnDomReady:       app.domReady,
		Menu:             Menu,
		OnBeforeClose:    app.OnBeforeClose,
		Bind: []interface{}{
			app,
			todo,
			device,
			app.monitor,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
