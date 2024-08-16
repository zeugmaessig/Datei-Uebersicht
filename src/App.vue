<template>
  <h1>Dateitabelle für Dokumente</h1>
  <p>Dateien können "hochgeladen" werden, die Tabelle speichert dabei die Dateieigenschaften und den lokalen Pfad. Beim Öffnen wird dieser aufgerufen, beim Löschen der Eintrag entfernt.</p>
  <p>Ein Klick auf den Titel der Datei bearbeitet nur den Titel der Datei im Array, nicht den lokalen Dateinamen.</p>
  <UploadDialog :items="items" :updateItems="updateItems" />
  <FileTable :items="items" :updateItems="updateItems" />
</template>
  
<script setup lang="ts">
  import { ref } from 'vue';
  import UploadDialog from './components/UploadDialog.vue';
  import FileTable from './components/FileTable.vue';
  
  const items = ref([
    { title: 'LeereDatei1', fileType: 'PDF', category: 'Vertrag', uploadedOn: '2024-08-15', url: '' },
    { title: 'LeereDatei2', fileType: 'DOC', category: 'Pläne', uploadedOn: '2024-08-10', url: '' },
    { title: 'LeereDatei3', fileType: 'JPG', category: 'Vertrag', uploadedOn: '2024-08-05', url: '' }
  ]);
  
  const updateItems = (newItems: any) => {
    items.value = newItems;
  };
</script>
  