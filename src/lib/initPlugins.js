AT.prototype.initPlugins = function () {

    var plugin;

    for (plugin in this.pluginList) {

        if (this.pluginList.hasOwnProperty(plugin) && AT.Plugins[plugin]) {

            AT.Plugins[plugin].initialize(this, this.pluginList[plugin]);

        }

    }
};
