<template>
    <div>
      <UploadDialog :items="items" :updateItems="updateItems" />
      <FileTable :items="items" :updateItems="updateItems" />
    </div>
</template>
  
<script setup lang="ts">
  import { ref } from 'vue';
  import UploadDialog from './components/UploadDialog.vue';
  import FileTable from './components/FileTable.vue';
  
  const items = ref([
    { title: 'Datei1', fileType: 'PDF', category: 'Vertrag', uploadedOn: '2024-01-15', url: '' },
    { title: 'Datei2', fileType: 'Word', category: 'Pläne', uploadedOn: '2024-01-10', url: '' },
    { title: 'Datei3', fileType: 'Excel', category: 'Vertrag', uploadedOn: '2024-01-05', url: '' }
  ]);
  
  const updateItems = (newItems: any) => {
    items.value = newItems;
  };
</script>
  