<script setup lang="ts">
  import { ref } from 'vue';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import InputText from 'primevue/inputtext';
  import FileUpload from 'primevue/fileupload';
  import Select from 'primevue/select';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';

  const items = ref([
      {title: 'Datei1', fileType: 'PDF', category: 'Vertrag', uploadedOn: '2024-01-15', url:''},
      {title: 'Datei2', fileType: 'Word', category: 'Pläne', uploadedOn: '2024-01-10', url:''},
      {title: 'Datei3', fileType: 'Excel', category: 'Vertrag', uploadedOn: '2024-01-05', url:''}
  ]);

  const filters = ref({
      global: { value: '' },
      fileType: { value: null },
      category: { value: null },
      title: { value: '' },
      uploadedOn: { value: null }
  });

  const selectedItems = ref([]);

  const fileTypeFilterOptions = ref([
    'pdf','docx','doc','xlsx','xls','ppt','pptx','txt','jpeg','jpg','png'
  ]);

  const categoryFilterOptions = ref([
      'Vertrag', 'Pläne', 'Zeichnungen', 'Exposé', 'Sonstige'
  ]);

  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  const clearFilter = () => {
      filters.value.fileType.value = null;
      filters.value.category.value = null;
      filters.value.title.value = '';
      filters.value.uploadedOn.value = null;
  };

  const showUploadDialog = ref(false);
  const newFileTitle = ref('');
  const selectedCategory = ref(null);
  const uploadedFiles = ref<File[]>([]);

  const onFileSelect  = (event: any) => {
    const files = event.files;
    if (files && files.length > 0) {
        uploadedFiles.value = files;
        console.log('Dateien erfolgreich hochgeladen:', files);
    } else {
        alert('Keine Datei hochgeladen.');
    }
  };

  const confirmUpload = () => {
    if (newFileTitle.value.trim() !== '' && selectedCategory.value && uploadedFiles.value.length > 0) {
        const file = uploadedFiles.value[0];
        const fileType = file.name.split('.').pop()?.toUpperCase() || 'Unbekannt';

        const fileURL = URL.createObjectURL(file);

        items.value.push({
            title: newFileTitle.value,
            fileType: fileType,
            category: selectedCategory.value,
            uploadedOn: new Date().toISOString().split('T')[0],
            url: fileURL,
        });

        showUploadDialog.value = false;
        newFileTitle.value = '';
        selectedCategory.value = null;
        uploadedFiles.value = [];
    } else {
        alert('Bitte alle erforderlichen Felder ausfüllen und eine Datei hochladen.');
    }
};

</script>

<template>
  <div>
    <Button label="Datei Hinzufügen" icon="pi pi-plus" @click="showUploadDialog = true" />

    <Dialog v-model:visible="showUploadDialog" header="Datei Hochladen" :style="{ width: '50vw' }" modal>
      <div class="p-fluid">
        <div class="p-field">
          <label>Titel</label>
          <InputText id="title" v-model="newFileTitle" placeholder="Titel eingeben" />
        </div>
        <div class="p-field">
          <label>Kategorie</label>
          <Select id="category" v-model="selectedCategory" :options="categoryFilterOptions" placeholder="Kategorie wählen" />
        </div>
        <div class="p-field">
          <label>Datei hochladen</label>
          <FileUpload 
            :auto="true" 
            name="file" 
            :multiple="false" 
            accept=".pdf,.docx,.doc,.xlsx,.xls,.ppt,.pptx,.txt,.jpeg,.jpg,.png" 
            :maxFileSize="10000000" 
            @select="onFileSelect"
          >
            <template #empty>
              <span>Datei hier ablegen oder klicken um auszuwählen.</span>
            </template>
          </FileUpload>
        </div>
      </div>
      <div class="p-dialog-footer">
        <Button label="Abbrechen" @click="showUploadDialog = false" class="p-button-text" />
        <Button label="Hochladen" @click="confirmUpload" />
      </div>
    </Dialog>
  </div>
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
          <Select 
            v-model="filterModel.value"
            :options="fileTypeFilterOptions"
            placeholder="Dateityp wählen"
            showClear
            @change="filterCallback()"
          />
        </template>
      </Column>

      <Column sortable field="category" header="Kategorie" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.category }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Select 
            v-model="filterModel.value" 
            :options="categoryFilterOptions" 
            placeholder="Kategorie wählen" 
            showClear 
            @change="filterCallback()" 
          />
        </template>
      </Column>

      <Column sortable field="title" header="Titel" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.title }}
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

      <Column sortable field="uploadedOn" header="Hochgeladen am" dataType="date" style="min-width: 12rem" :filter="true">
        <template #body="{ data }">
          {{ formatDate(data.uploadedOn) }}
        </template>
      </Column>

      <Column field="actions" header="Aktionen" style="min-width: 12rem">
        <template #body="{ data }">
          <a :href="data.url" target="_blank">
              <Button type="button" icon="pi pi-eye" class="p-button-text" label="Öffnen" />
          </a>
          <Button type="button" icon="pi pi-trash" class="p-button-text p-button-danger" label="Löschen" />
          <Button type="button" icon="pi pi-share-alt" class="p-button-text" label="Teilen" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style>
</style>
