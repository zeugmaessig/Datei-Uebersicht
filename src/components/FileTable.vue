<template>

  <Button type="button" icon="pi pi-share-alt" class="p-button-text" label="Auswahl Teilen" />

  <DataTable
    :value="items"
    v-model:filters="filters"
    paginator
    editMode="cell"
    @cell-edit-complete="onCellEditComplete"
    removableSort
    :rows="10"
    filterDisplay="menu"
    :globalFilterFields="['fileType', 'category', 'title', 'uploadedOn']"
    selectionMode="multiple"
     v-model:selection="selectedItems"
  >
    <template #empty> Keine Dateien gefunden. </template>
    <template #loading> Daten werden geladen. Bitte warten. </template>

    <template #header>
      <div class="flex justify-between">
        <InputText v-model="filters['global'].value" icon="pi pi-search" placeholder="Keyword Search" />
      </div>
    </template>
  
    <Column selectionMode="multiple" headerStyle="width: 3rem" />
  
    <Column sortable field="fileType" :showFilterMatchModes="false" header="Dateityp" style="min-width: 12rem">
      <template #body="{ data }">
        {{ data.fileType }}
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <Select 
          v-model="filterModel.value"
          :options="fileTypeFilterOptions"
          placeholder="Dateityp wählen"
          showClear
          @change="filterCallback()"
        />
      </template>
    </Column>
  
    <Column sortable field="category" :showFilterMatchModes="false" header="Kategorie" style="min-width: 12rem">
      <template #body="{ data }">
        {{ data.category }}
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <Select 
          v-model="filterModel.value" 
          :options="categoryFilterOptions" 
          placeholder="Kategorie wählen" 
          @change="filterCallback()" 
        />
      </template>
    </Column>
  
    <Column sortable field="title" :showFilterMatchModes="false" header="Titel" style="min-width: 12rem; width: 20%;">
      <template #body="{ data }">
        {{ data.title }}
      </template>
      <template #editor="{ data, field }">
        <InputText v-model="data[field]" autofocus style="width: 100%;" />
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <InputText
          v-model="filterModel.value"
          type="text"
          placeholder="Nach Titel suchen"
          @input="filterCallback()"
        />
      </template>
    </Column>
  
    <Column sortable field="uploadedOn" :showFilterMatchModes="false" header="Hochgeladen am" dataType="date" style="min-width: 12rem" :filter="true">
      <template #body="{ data }">
        {{ formatDateTime(data.uploadedOn) }}
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <InputText
          v-model="filterModel.value"
          type="date"
          placeholder="Datum wählen"
          @input="filterCallback()"
        />
      </template>
    </Column>
  
    <Column field="actions" header="" style="min-width: 12rem">
      <template #body="{ data }">
        <a :href="data.url" target="_blank">
          <Button type="button" icon="pi pi-eye" class="p-button-text p-button-open" label="Öffnen" />
        </a>
        <Button type="button" icon="pi pi-trash" class="p-button-text p-button-danger" label="Löschen" @click="deleteItem(data)" />
      </template>
    </Column>
  </DataTable>
</template>
  
<script setup lang="ts">
  import { ref } from 'vue';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import InputText from 'primevue/inputtext';
  import Select from 'primevue/select';
  import Button from 'primevue/button';
    
  const props = defineProps({
    items: {
      type: Array,
      default: () => []
    },
    updateItems: {
      type: Function,
      default: () => {}
    }
  });

    
  const filters = ref({
    global: { value: '' },
    fileType: { value: null },
    category: { value: null },
    title: { value: '' },
    uploadedOn: { value: null }
  });
    
  const selectedItems = ref([]);
  const fileTypeFilterOptions = ref([
    'pdf', 'docx', 'doc', 'xlsx', 'xls', 'ppt', 'pptx', 'txt', 'jpeg', 'jpg', 'png'
  ]);
    
  const categoryFilterOptions = ref([
    'Vertrag', 'Pläne', 'Zeichnungen', 'Exposé', 'Sonstige'
  ]);
    
  const formatDateTime = (dateTime: string) => new Date(dateTime).toLocaleString();
    
  const deleteItem = (itemToDelete: any) => {
    props.updateItems(props.items.filter(item => item !== itemToDelete));
  };
    
  const onCellEditComplete = (e: any) => {
    const { newValue, field, data } = e;
    if (field === 'title' && newValue.trim()) {
      data[field] = newValue;
    } else {
      e.preventDefault();
    }
  };
</script>

<style>

  tr{
    background-color: #fff !important;
  }

  .p-datatable-header {
    background-color: #fff !important;
  }

  .p-datatable-header-cell {
    background-color: #fff !important;
  }

  .p-datatable-filter-overlay-popover {
    background: #fff !important;
    border: none !important;
  }

  .p-select {
    background: #fff !important;
  }

  .p-select-overlay {
    background: #fff !important;
    border: none !important;
  }
  .p-select-option:not(.p-select-option-selected):not(.p-disabled).p-focus {
    background: #06b6d4 !important;
  }

  .p-inputtext {
    background-color: #fff !important;
  }

  .p-button {
    border: 1px solid #06b6d4 !important;
    margin: 5px;
  }
  .p-button:hover {
    background: #06b6d4 !important;
    *{
      color: #fff !important;
    }
  }

  .p-button-icon-only {
    border: 0px solid transparent !important;
    margin: 0px;
  }

  .p-primary-button {
    background: #06b6d4 !important;
    transition: scale 0.2s !important;
  }
  .p-primary-button * {
    color: #fff !important;
  }
  .p-primary-button:hover {
    background: #06b6d4 !important;
    scale: 1.05;
  }

  .p-button-danger {
    border: 1px solid rgb(216, 19, 19) !important;
  }
  .p-button-danger:hover {
    background-color:rgb(216, 19, 19) !important;
  }


  .p-button-open {
    border: 1px solid rgb(13, 197, 29) !important;
  }
  .p-button-open:hover {
    background-color:rgb(13, 197, 29) !important;
  }

  .p-inputtext:focus{
    border-color: #06b6d4 !important;
  }

  .p-inputtext:hover{
    border-color: #06b6d4 !important;
  }

  .p-datatable-filter-apply-button{
    background: #06b6d4 !important;
  }

  .p-checkbox-box{
    background-color: #fff !important; 
  }

  .p-datatable-filter-apply-button span {
    color: #fff !important;
  }

  .p-checkbox *{
    color: #fff !important; 
  }

  .p-checkbox-checked .p-checkbox-box {
    background: #06b6d4 !important;
    border-color: #06b6d4 !important;
  }

  .p-checkbox-box:hover {
    border-color: #06b6d4 !important;
  }

  input[type="checkbox" i] {
    background-color: initial !important;
  }

  .p-paginator {
    background-color: #fff !important;
  }

  .p-paginator-page-selected{
    background-color: transparent !important;
    border: 1px solid #06b6d4 !important;
  }

</style>
  