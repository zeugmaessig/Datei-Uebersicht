<template>
    <!-- Gleicher Code wie vorher -->
    <Button label="Datei Hochladen" icon="pi pi-plus" @click="showUploadDialog = true" />
  
    <Dialog v-model:visible="showUploadDialog" header="Datei Hochladen" :style="{ width: '50vw' }" modal>
      <div class="p-fluid">
        <div class="p-field">
          <label for="title">Titel</label>
          <InputText id="title" v-model="newFileTitle" placeholder="Titel eingeben" />
        </div>
        <div class="p-field">
          <label for="category">Kategorie</label>
          <Select id="category" v-model="selectedCategory" :options="categoryFilterOptions" placeholder="Kategorie wählen" />
        </div>
        <div class="p-field">
          <label for="file">Datei hochladen</label>
          <FileUpload 
            mode="basic"
            name="file"
            :customUpload="true"
            :multiple="false"
            accept=".pdf,.docx,.doc,.xlsx,.xls,.ppt,.pptx,.txt,.jpeg,.jpg,.png"
            :maxFileSize="10000000"
            @select="onFileSelect"
            @upload="onUpload"
          />
        </div>
      </div>
      <div class="p-dialog-footer">
        <Button label="Abbrechen" @click="showUploadDialog = false" class="p-button-text" />
        <Button label="Hochladen" @click="confirmUpload" />
      </div>
    </Dialog>
</template>
  
<script setup lang="ts">
    import { ref } from 'vue';
    import Dialog from 'primevue/dialog';
    import InputText from 'primevue/inputtext';
    import FileUpload from 'primevue/fileupload';
    import Select from 'primevue/select';
    import Button from 'primevue/button';
    
    const props = defineProps({
        items: Array,
        updateItems: Function,
    });
    
    const showUploadDialog = ref(false);
    const newFileTitle = ref('');
    const selectedCategory = ref(null);
    const uploadedFiles = ref<File[]>([]);
    
    const categoryFilterOptions = ref([
        'Vertrag', 'Pläne', 'Zeichnungen', 'Exposé', 'Sonstige'
    ]);
    
    const onFileSelect = (event: any) => {
        const files = event.files;
        uploadedFiles.value = files.length > 0 ? files : [];
        if (files.length === 0) alert('Keine Datei hochgeladen.');
    };
    
    const customBase64Uploader = async (event: any) => {
        const file = event.files[0];
        const reader = new FileReader();
        const blob = await fetch(file.objectURL).then(r => r.blob());
    
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
        const base64data = reader.result as string;
        console.log('Base64 Daten:', base64data);
        alert('Base64-Datei erfolgreich hochgeladen: ' + file.name);
        };
    };
    
    const confirmUpload = () => {
        if (newFileTitle.value.trim() && selectedCategory.value && uploadedFiles.value.length) {
                const file = uploadedFiles.value[0];
                const fileType = file.name.split('.').pop()?.toUpperCase() || 'Unbekannt';
                const fileURL = URL.createObjectURL(file);

                // Kopiere die bestehende Liste und füge das neue Element hinzu
                const updatedItems = [...props.items];
                    updatedItems.push({
                    title: newFileTitle.value,
                    fileType,
                    category: selectedCategory.value,
                    uploadedOn: new Date().toISOString(),
                    url: fileURL
                });

                // Aktualisiere die items-Liste
                props.items.splice(0, props.items.length, ...updatedItems);

                // Dialog schließen und Felder zurücksetzen
                showUploadDialog.value = false;
                newFileTitle.value = '';
                selectedCategory.value = null;
                uploadedFiles.value = [];
            } else {
                alert('Bitte alle erforderlichen Felder ausfüllen und eine Datei hochladen.');
            }
        };
    
    const onUpload = () => {
        const file = uploadedFiles.value[0];
        if (file) {
        customBase64Uploader({ files: [file] });
        } else {
        alert('Keine Datei zum Hochladen ausgewählt.');
        }
    };
</script>
  