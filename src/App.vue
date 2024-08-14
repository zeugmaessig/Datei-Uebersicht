<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';

// Beispiel-Daten für die DataTable
const items = ref([
    { id: 1, title: 'Datei1', fileType: 'PDF', category: 'Dokumentation', uploadedOn: '2024-01-15', checked: true, actions: ['Öffnen', 'Löschen', 'Teilen'] },
    { id: 2, title: 'Datei2', fileType: 'Word', category: 'Bericht', uploadedOn: '2024-01-10', checked: false, actions: ['Öffnen', 'Löschen', 'Teilen'] },
    { id: 3, title: 'Datei3', fileType: 'Excel', category: 'Tabelle', uploadedOn: '2024-01-05', checked: true, actions: ['Öffnen', 'Löschen', 'Teilen'] }
]);

// Filter-Konfiguration
const filters = ref({
    global: { value: '' },
    fileType: { value: null },
    category: { value: null },
    title: { value: '' },
    uploadedOn: { value: null }
});

// Auswahl der Checkboxen speichern
const selectedItems = ref([]);  // Hier werden die ausgewählten Items gespeichert

// Daten für Filter
const fileType = ref([
    'PDF','jpg','word',
]);

const categories = ref([
    'Dokumentation','Bericht','Tabelle'
]);

const formatDate = (date: string) => new Date(date).toLocaleDateString();

const filterByYear = (dataDate: string, filterModel: any) => {
    if (!filterModel.value) return true;
    const year = new Date(dataDate).getFullYear();
    const selectedYear = new Date(filterModel.value).getFullYear();
    return year === selectedYear;
};

const clearFilter = () => {
    filters.value.fileType.value = null;
    filters.value.category.value = null;
    filters.value.title.value = '';
    filters.value.uploadedOn.value = null;
};
</script>

<template>
  <div>
    <DataTable
      :value="items"
      v-model:filters="filters"
      paginator
      removableSort
      :rows="10"
      dataKey="id"
      filterDisplay="menu" 
      :globalFilterFields="['fileType', 'category', 'title', 'uploadedOn']"
      selectionMode="multiple"
      v-model:selection="selectedItems"
    >

      <template #empty> Keine Dateien gefunden. </template>
      <template #loading> Daten werden geladen. Bitte warten. </template>

      <Column selectionMode="multiple" headerStyle="width: 3rem" />

      <Column sortable field="fileType" header="Dateityp" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.fileType }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Select v-model="filterModel.value" :options="fileType" placeholder="Dateityp wählen" showClear @change="filterCallback()" />
        </template>
      </Column>

      <Column sortable field="category" header="Kategorie" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.category }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Select v-model="filterModel.value" :options="categories" placeholder="Kategorie wählen" showClear @change="filterCallback()" />
        </template>
      </Column>

      <Column sortable field="title" header="Titel" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.title }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" placeholder="Nach Titel suchen" @input="filterCallback()" />
        </template>
      </Column>

      <Column sortable field="uploadedOn" header="Hochgeladen am" dataType="date" style="min-width: 12rem" :filter="true" :filterFunction="filterByYear">
        <template #body="{ data }">
          {{ formatDate(data.uploadedOn) }}
        </template>
      </Column>

      <Column field="actions" header="Aktionen" style="min-width: 12rem">
        <template #body="{ data }">
          <Button type="button" icon="pi pi-eye" class="p-button-text" label="Öffnen" />
          <Button type="button" icon="pi pi-trash" class="p-button-text p-button-danger" label="Löschen" />
          <Button type="button" icon="pi pi-share-alt" class="p-button-text" label="Teilen" />
        </template>
      </Column>
    </DataTable>

  </div>
</template>

<style>
/* Füge benutzerdefinierte Styles hinzu, falls nötig */
</style>
