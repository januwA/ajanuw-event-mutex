## event mutex

```js
import { EventMutex } from 'ajanuw-event-mutex';

const m = new EventMutex((e) => {
  console.log(e);
});
document.querySelector("#btn").addEventListener("click", m.listener);
```


## build
```sh
$ npm run build:prod
```