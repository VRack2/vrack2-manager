<template>
    <div class="container connections-container">
      <div class="d-flex justify-content-center mb-3">
        <h2>VRack2 Менеджер подключений</h2>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="d-flex justify-content-between align-items-center">
            <span>Список доступных</span>
            <div class="btn-group">
              <button class="btn btn-outline-success" @click="$router.push({name: 'connectionAdd'})"><i class="bi bi-plus-circle-fill"></i></button>
              <button class="btn btn-outline-warning" @click="$router.push({name: 'connectionImport'})">Импорт <i class="bi bi-box-arrow-in-right"></i></button>
              <button class="btn btn-outline-info" @click="$router.push({name: 'connectionExport'})">Экспорт <i class="bi bi-box-arrow-right"></i> </button>
            </div>
          </div>
        </div>
        
        <ul class="list-group list-group-flush">
          <li class="list-group-item" v-for="connection of settings.connections" :key="connection.id">
            <div class="d-flex justify-content-between ">
              <div><h5>{{ connection.name }}</h5>
                  <div>{{ connection.address }}</div>
                  <small class="text-body-secondary">{{ connection.description }}</small>
              </div>
              <div>
                <div class="btn-group">
                  <button class="btn btn-success" @click="$router.push({ name: 'manager', params: { id: connection.id } })">Запуск <i class="bi bi-play-fill"></i></button>
                  <button class="btn btn-warning" @click="$router.push({ name: 'connectionEdit', params: { id: connection.id } })"><i class="bi bi-pencil-fill"></i></button>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div class="card-body">
          <p class="card-text">Используйте кнопку "+"" для добавления нового подключения.</p>
        </div>
      </div>
    </div>
</template>

<script>
import { inject } from 'vue';

export default {
  name: 'ConnectionsView',
  setup(){
    const settings = inject('settings')
    return { settings }
  }
}
</script>


<style scoped>
.connections-container {
  margin-top: 2%;
}
</style>