<template>
    <PanelHeader :img="Logo">Manager</PanelHeader>
    <PanelNav>
        <PanelNavElement :event="() => { $router.push('/') }">
            <i class="bi bi-diagram-3-fill"></i><span class="ps-2">Менеджер соединений</span>
        </PanelNavElement>
        <PanelNavGroup>VRack2 Сервис</PanelNavGroup>
        <PanelNavList>
            <!-- {{ $route.path }} -->
            <PanelNavElement :active="$route.name === 'manager'" :event="() => { $router.push({name: 'manager', params: {id: $route.params.id } }) }">
                <i class="bi bi-box-fill"></i><span class="ps-2">Сервис</span>
            </PanelNavElement>
            <PanelNavElement :active="$route.path.includes('keymanager')"  v-if="this.remote.checkAccess('apiKeyList')" :event="() => { $router.push({name: 'keyManager', params: {id: $route.params.id } }) }">
                <i class="bi bi-key-fill"></i><span class="ps-2">Менеджер Ключей</span>
            </PanelNavElement>
            <PanelNavElement :active="$route.path.includes('devicemanager')" v-if="this.remote.checkAccess('vendorDeviceInfo')" :event="() => { $router.push({name: 'deviceManager'}) }">
                <i class="bi bi-pc-horizontal"></i><span class="ps-2">Менеджер Устройств</span>
            </PanelNavElement>
            <PanelNavElement v-if="this.remote.checkAccess('structureGet')" :event="() => { getMainStructure() }">
                <i class="bi bi-map-fill"></i><span class="ps-2">Структура сервиса</span>
            </PanelNavElement>
            <!-- {{ $route.name }} -->
            <PanelNavElement :active="$route.path.includes('serviceApi')" :event="() => { $router.push({name: 'serviceApi', params: {id: $route.params.id } }) }">
                <i class="bi bi-asterisk"></i><span class="ps-2">API сервиса</span>
            </PanelNavElement>
        </PanelNavList>
    </PanelNav>
</template>
<script>

import Logo from "@/assets/logo2.png"
import PanelHeader from "@/components/SidePanel/PanelHeader.vue";
import PanelNav from "@/components/SidePanel/PanelNav.vue";
import PanelNavGroup from "@/components/SidePanel/PanelNavGroup.vue";
import PanelNavList from "@/components/SidePanel/PanelNavList.vue";
import PanelNavElement from "@/components/SidePanel/PanelNavElement.vue";
import { inject } from "vue";

export default {
    name: 'SideNavigationWidget',
    components: {
        PanelHeader,
        PanelNav,
        PanelNavGroup,
        PanelNavList,
        PanelNavElement
    },
    setup() {
        const ready = inject('ready')
        const remote = inject('remote')
        const setMap = inject('setMap')
        return { Logo, ready, remote, setMap }
    },

    methods: {
        async getMainStructure() {
            try {
                const struct = await this.remote.command('structureGet', { id: 'vrack2' })
                this.setMap(struct, this.getStructureActions())
            } catch (error) {
                this.setMessage('Error set map', error.toString(), false, false)
            }
        },

        getStructureActions(){
            const actions = []
            if (this.remote.checkAccess('structureUpdate')) 
                actions.push({ caption: 'Save', action: this.updateMainStructure.bind(this)})
            return actions
        },

        async updateMainStructure(structure){
            await this.remote.command('structureUpdate', { id: 'vrack2', structure })
        }
    }
}
</script>

<style></style>