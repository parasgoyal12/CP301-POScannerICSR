document.addEventListener("DOMContentLoaded", () => {

    // retrieve important DOM elements
    const fileUploadElem = document.querySelector("input#file-upload")
    const formElem = document.querySelector("form#file-upload-form")
    const selectedFilesList = document.querySelector("ul#selected-files-list")
    let storedFiles = [];
    // file input change event - create list item for each selected file
    fileUploadElem.addEventListener("change", (event) => {
      // careful treating NodeLists like arrays; in old browsers theyre missing many of the properties
      // while (selectedFilesList.firstChild) {
      //   selectedFilesList.removeChild(selectedFilesList.firstChild);
      //   }
      Array.from(fileUploadElem.files).forEach((file) => {
        let listItem = document.createElement('li')
        listItem.classList.add('list-group-item');
        listItem.innerHTML = file.name + ' - ' + file.type
        selectedFilesList.appendChild(listItem)
  
        // let progressElem = document.createElement('progress')
        // progressElem.setAttribute('value',0)
        // listItem.appendChild(progressElem)
  
        // save reference to create DOM element in file
        file.domElement = listItem
        storedFiles.push(file);
      })
    })
  
    // form submit event
    formElem.addEventListener("submit", (event) => {
      // prevent normal form submit behavior 
      event.preventDefault()
      formElem.querySelector('input[type=submit').disabled = true
      // prepare promise execution context
      const promiseContext = {
        formElem: formElem,
        fileUploadElem: storedFiles,
        selectedFilesList: selectedFilesList
      }
  
      // use AsyncSequenceIterator class to upload files sequentially
      const iterationCount = storedFiles.length - 1
      new AsyncSequenceIterator(iterationCount, createUploadPromise, promiseContext).whenComplete.then( 
        // success
        () => {
          alert('All uploads completed successfully! You will be redirected in 2s');
          setTimeout(()=>window.location.replace("/savedPoPage"),2000);
        },
        // failure
        () => {
          alert('Error Uploading some files. They may be present already.')
        }
      // disable any further uploads until page refresh
      ).finally( () => {
        formElem.querySelector('input[type=submit').disabled = true
        setTimeout(()=>window.location.replace("/savedPoPage"),2000);
      })
  
    })
    let dropArea = document.querySelector(".dropzone");
    dropArea.addEventListener('click',()=>{document.querySelector("#file-upload").click();});
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false)
    })
    ;['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, highlight, false)
    })
    
    ;['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, unhighlight, false)
    })
    
    function highlight(e) {
      dropArea.style.backgroundColor = "#ccc";
    }
    
    function unhighlight(e) {
      // dropArea.classList.remove('highlight')
      dropArea.style.backgroundColor = "#fff";
    }
    function preventDefaults (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    dropArea.addEventListener('drop', handleDrop, false)

    function handleDrop(e) {
      let dt = e.dataTransfer
      let files = dt.files

      handleFiles(files)
    }
    function handleFiles(files){
      Array.from(files).forEach((file) => {
        let listItem = document.createElement('li')
        listItem.classList.add('list-group-item');
        listItem.innerHTML = file.name + ' - ' + file.type
        selectedFilesList.appendChild(listItem)
  
        // let progressElem = document.createElement('progress')
        // progressElem.setAttribute('value',0)
        // listItem.appendChild(progressElem)
  
        // save reference to create DOM element in file
        file.domElement = listItem
        storedFiles.push(file);
      })
    }
  
  });
  let progElem = document.querySelector(".progress-bar");
  function createUploadPromise(iteration) {
  
    return new Promise((resolve,reject) => {
      // create FormData object - add file and form fields manually
      const formData = new FormData()
      formData.append('fileUpload', this.fileUploadElem[iteration])
      // dispatch xhr to start file upload - listen to file upload complete event and notify user
      let xhr = new XMLHttpRequest()
  
      // set onload (i.e. upload completion) callback
      xhr.onload = () => {
        progElem.style.width=`${100*(iteration+1)/(this.fileUploadElem.length)}%`;
        progElem.innerText = `${100*(iteration+1)/(this.fileUploadElem.length)}%`;
        if (xhr.readyState === 4 && xhr.status === 200) {
          this.selectedFilesList.querySelectorAll('li')[iteration].classList.add('list-group-item-success');
          resolve()
        } else {
          this.selectedFilesList.querySelectorAll('li')[iteration].classList.add('list-group-item-danger');
          reject()
        }
      }
  
      // watch for file upload progress
      // xhr.upload.addEventListener('progress', (e) => {
      //   this.selectedFilesList.querySelectorAll('progress')[iteration].setAttribute("value", (e.loaded / e.total * 100) )
      // })
      
      // initiate AJAX request
      xhr.open("POST", this.formElem.action)
      xhr.send(formData)
  
    })
    
  }