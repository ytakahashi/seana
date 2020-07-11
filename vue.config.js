module.exports = {
  runtimeCompiler: true,
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: "Seana",
        appId: "net.ytakahashi.seana",
        copyright: "Copyright © 2020 ytakahashi",
        mac: {
          icon: "public/icon.icns"
        }
      }
    }
  }
}
