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
    { title: 'Datei1', fileType: 'PDF', category: 'Vertrag', uploadedOn: '2024-01-15', url: '' },
    { title: 'Datei2', fileType: 'Word', category: 'Pläne', uploadedOn: '2024-01-10', url: '' },
    { title: 'Datei3', fileType: 'Excel', category: 'Vertrag', uploadedOn: '2024-01-05', url: '' }
]);

const filters = ref({
    global: { value: '' },
    fileType: { value: null },
    category: { value: null },
    title: { value: '' },
    uploadedOn: { value: null }
});

const fileTypeFilterOptions = ref([
    'pdf', 'docx', 'doc', 'xlsx', 'xls', 'ppt', 'pptx', 'txt', 'jpeg', 'jpg', 'png'
]);

const categoryFilterOptions = ref([
    'Vertrag', 'Pläne', 'Zeichnungen', 'Exposé', 'Sonstige'
]);

const formatDateTime = (dateTime: string) => new Date(dateTime).toLocaleString();

const selectedItems = ref([]);

const deleteItem = (itemToDelete: any) => {
    items.value = items.value.filter(item => item !== itemToDelete);
};

const showUploadDialog = ref(false);
const newFileTitle = ref('');
const selectedCategory = ref(null);
const uploadedFiles = ref<File[]>([]);

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
        alert(`Base64-Datei erfolgreich hochgeladen: ${file.name}`);
    };
};

const confirmUpload = () => {
    if (newFileTitle.value.trim() && selectedCategory.value && uploadedFiles.value.length) {
        const file = uploadedFiles.value[0];
        const fileType = file.name.split('.').pop()?.toUpperCase() || 'Unbekannt';
        const fileURL = URL.createObjectURL(file);

        items.value.push({
            title: newFileTitle.value,
            fileType,
            category: selectedCategory.value,
            uploadedOn: new Date().toISOString(),
            url: fileURL
        });

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

const onCellEditComplete = (e: any) => {
    const { newValue, field, data } = e;
    if (field === 'title' && newValue.trim()) {
        data[field] = newValue;
    } else {
        e.preventDefault();
    }
};
</script>

<template>
    <div>
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
    </div>
    <div>
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

            <Column field="actions" header="Aktionen" style="min-width: 12rem">
                <template #body="{ data }">
                    <a :href="data.url" target="_blank">
                        <Button type="button" icon="pi pi-eye" class="p-button-text" label="Öffnen" />
                    </a>
                    <Button type="button" icon="pi pi-trash" class="p-button-text p-button-danger" label="Löschen" @click="deleteItem(data)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style>
</style>
