export const Keyboard = (value: string) => {
    const key = {
        value,
        pressed: false,

        press: null as (() => void) | null,
        release: null as (() => void) | null,

        downHandler(event: KeyboardEvent) {
            if (event.key === key.value) {
                if (!key.pressed && key.press) key.press();
                key.pressed = true;
                event.preventDefault();
            }
        },

        upHandler(event: KeyboardEvent) {
            if (event.key === key.value) {
                if (key.pressed && key.release) key.release();
                key.pressed = false;
                event.preventDefault();
            }
        },

        _subscribed: false,
        subscribe() {
            if (this._subscribed) return;
            window.addEventListener("keydown", downListener, false);
            window.addEventListener("keyup", upListener, false);
            this._subscribed = true;
        },

        unsubscribe() {
            if (!this._subscribed) return;
            window.removeEventListener("keydown", downListener);
            window.removeEventListener("keyup", upListener);
            this._subscribed = false;
        },
    };

    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);
    key.subscribe();

    return key;
};

