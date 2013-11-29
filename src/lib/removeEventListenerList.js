function removeEventListenerList(list, event, fn) {
    for (var i = 0, len = list.length; i < len; i++) {
        list[i].removeEventListener(event, fn, false);
    }
}
