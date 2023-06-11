## event mutex

```js
import { EventMutex } from 'ajanuw-event-mutex';

const m = new EventMutex((e) => {
  console.log(e);
});
document.querySelector("#btn").addEventListener("click", () => m.listener());
```

## vue
```html
<template>
  <button type="button" @click="submitMutex.listener($event)">CLICK</button>
  <button type="button" @click="submitMutex.unlock()">UNLOCK</button>
  <view> {{ submitMutex.isLock }} </view>
</template>

<script setup>
import { reactive } from "vue"
import { EventMutex } from 'ajanuw-event-mutex';

const submitMutex = reactive(new EventMutex((e) => {
  console.log(e);
}, false));
</script>
```

## build
```sh
$ npm run build
```