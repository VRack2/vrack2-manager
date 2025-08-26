<template>

  <div class="p-3" style="font-weight: bold;"><img v-if="img" :src="img" width="60"> 
      <div class="d-flex justify-content-between align-items-center">
      <div><i class="bi bi-hdd-rack-fill"></i> Сервисы</div><button type="button" @click="servicesReload()" class="btn btn-dark btn-sm"><i class="bi bi-arrow-repeat"></i></button>
    </div>
  </div>

  <PanelNav>
    <template v-for="group in servicesTree" v-bind:key="group.name">
      <PanelNavGroup>{{ group.group }}</PanelNavGroup>
      <PanelNavList>
        <PanelNavElement v-for="service in group.list" v-bind:key="service.id"
          :event="() => $router.push({ name: 'serviceControl', params: { service: service.id, id: $route.params.id } })"
          :active="($route.params.service === service.id)">
          <span style="display: block;" class="">
            <ServiceGear :errors="services[service.id].errors" :run="services[service.id].run"></ServiceGear>
            {{ service.name }}
          </span>
          <small style="color: #AAA"><b>{{ service.id }}</b></small>
        </PanelNavElement>
    </PanelNavList>
    </template>
  </PanelNav>

</template>

<script>
// import PanelHeader from '@/components/SidePanel/PanelHeader.vue';
import PanelNav from '@/components/SidePanel/PanelNav.vue';
import PanelNavElement from '@/components/SidePanel/PanelNavElement.vue';
import PanelNavGroup from '@/components/SidePanel/PanelNavGroup.vue';
import PanelNavList from '@/components/SidePanel/PanelNavList.vue';
import ServiceGear from '@/components/SidePanel/Services/ServiceGear.vue';

export default {
  name: 'ServicesWidget',
  components: {
    // PanelHeader,
    PanelNav,
    PanelNavGroup,
    PanelNavElement,
    ServiceGear,
    PanelNavList
  },
  props: ['services', 'servicesTree', 'servicesReload']
}
</script>

<style>
.dbm-list-header {
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 16px;
  padding-right: 15px;
  padding-left: 10px;
  font-weight: 700;
}

.dbm-list {
  font-size: 14px;
  padding-right: 15px;
  padding-left: 15px;
}

.dbm-list-group {
  font-size: 12px;
  font-weight: bold;
  padding-right: 10px;
  padding-left: 10px;
  padding-top: 5px;
  padding-bottom: 5px;

  margin-top: 0px;
  margin-bottom: 0px;
  /* color: #1f2f3d; */
  color: #fff;
  /* background-color: rgb(213, 227, 235); */
  background-color: #6c757d
}

.dbm-list-element {
  font-size: 14px;
  padding-right: 15px;
  padding-left: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-left: 0px;
  background-color: #212529;
  border-right: #794b07 1px solid;
  /* border-left:rgb(202, 229, 255) 3px solid; */
}

.dbm-list-element-active {
  background-color: rgb(57, 57, 57) !important;
  border-right: #ecbd76 5px solid;
}

.dbm-list-element:hover {
  cursor: pointer;
  background-color: #131313 !important;
}

.dbm-list-element-badgers {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}

.dbm-list {
  list-style: none;
  margin: 0;
  padding: 0;
  width: auto;
  min-width: 150px;
}
</style>
