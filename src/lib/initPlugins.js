ArcherTarget.prototype.initPlugins = function () {

    var plugin;

    for (plugin in this.pluginList) {

        if (this.pluginList.hasOwnProperty(plugin) && ArcherTarget.Plugins[plugin]) {

            ArcherTarget.Plugins[plugin].initialize(this, this.pluginList[plugin]);

        }

    }
};
