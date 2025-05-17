<template>
    <div class="d-flex justify-content-center mt-3">
        <h2>Нет подключеных каналов</h2>
    </div>
    <div class="text-center">
      <p>Для добавление канала отслеживания воспользуйтесь выбором необходимого сервиса и устройства.</p>
      <p>После чего во вкладке "События & Данные" выберите нужный вам канал.</p>
    </div>
    <div class="">
      <h4>Виды каналов и их назначение:</h4>
      <ul>
        <li><b>terminal</b> - Терминальная информация / debug информация. <span class="text-secondary">Используется для общего понимания работы устройства. Обычно отключается после debug сессии</span></li>
        <li><b>notify</b> - Нотификационные сообещния. <span class="text-secondary">Например "Выполнил работу", "Получил сообщение", "Записал все нужные данные в файл"</span></li>
        <li><b>event</b> - Сообщения о событиях. <span class="text-secondary">Обычно эти сообщения именут через точку и они описывают событие краткими словами типа "backup.start","backup.end","converter.disconnect"</span></li>
        <li><b>alert</b> - Тревожные сообщения. <span class="text-secondary">Обычно их используют для уведомления о том, что, что-то пошло не так, обычно они отправляются в мессенджер и тп</span></li>
        <li><b>error</b> - Сообщения при перехватах исключений</li>
      </ul>
    </div>
    
  </template>
  <script>
  
//   import { ref } from 'vue';
  
  export default {
    name: 'ChannelsView',
    components: {},
    setup() {
        return { }
    },
  }
  </script>


<style>

</style>