AT.prototype.initPlugins = function () {

	var plugin;

	this.activePlugins = {};

	for (plugin in this.pluginList) {

		if (this.pluginList.hasOwnProperty(plugin) && AT.Plugins[plugin]) {
			console.log(plugin);
			this.activePlugins[plugin] =
				AT.Plugins[plugin].init(this, this.pluginList[plugin]);

		}

	}
};
