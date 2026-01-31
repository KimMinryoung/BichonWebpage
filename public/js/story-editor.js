document.addEventListener('DOMContentLoaded', () => {
    const fileSelect = document.getElementById('file-select');
    const sceneList = document.getElementById('scene-list');
    const editorPane = document.getElementById('editor-pane');
    const editorPlaceholder = document.getElementById('editor-placeholder');
    const currentSceneTitle = document.getElementById('current-scene-id');
    const sceneLocation = document.getElementById('scene-location');
    const sceneScript = document.getElementById('scene-script');
    const sceneActions = document.getElementById('scene-actions');
    const saveBtn = document.getElementById('save-btn');
    const statusMsg = document.getElementById('status-message');

    let currentSceneId = null;

    // Load file list
    fetch('/api/story/files')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                data.files.forEach(file => {
                    const option = document.createElement('option');
                    option.value = file;
                    option.textContent = file;
                    fileSelect.appendChild(option);
                });
            }
        });

    // Handle file selection
    fileSelect.addEventListener('change', () => {
        const filePath = fileSelect.value;
        if (!filePath) {
            sceneList.innerHTML = '';
            showPlaceholder();
            return;
        }

        fetch(`/api/story/scenes/${filePath}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    renderSceneList(data.scenes);
                }
            });
    });

    function renderSceneList(scenes) {
        sceneList.innerHTML = '';
        scenes.forEach(scene => {
            const li = document.createElement('li');
            li.className = 'scene-item';
            li.textContent = scene.scene_id;
            li.dataset.id = scene.scene_id;
            li.addEventListener('click', () => loadScene(scene.scene_id));
            sceneList.appendChild(li);
        });
    }

    function loadScene(sceneId) {
        // Highlight active
        document.querySelectorAll('.scene-item').forEach(el => el.classList.remove('active'));
        document.querySelector(`.scene-item[data-id="${sceneId}"]`).classList.add('active');

        fetch(`/api/story/scene/${sceneId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const details = data.details;
                    currentSceneId = sceneId;
                    currentSceneTitle.textContent = sceneId;
                    sceneLocation.value = details.location || '';
                    sceneScript.value = (details.script || []).join('\n');
                    sceneActions.value = (details.actions || []).join('\n');

                    editorPane.style.display = 'flex';
                    editorPlaceholder.style.display = 'none';
                }
            });
    }

    function showPlaceholder() {
        editorPane.style.display = 'none';
        editorPlaceholder.style.display = 'flex';
    }

    // Save changes
    saveBtn.addEventListener('click', () => {
        if (!currentSceneId) return;

        const script = sceneScript.value.split('\n').map(l => l.trim()).filter(l => l !== '');
        const actions = sceneActions.value.split('\n').map(l => l.trim()).filter(l => l !== '');
        const location = sceneLocation.value.trim();

        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';

        fetch(`/api/story/scene/${currentSceneId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ script, actions, location })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showMessage('Changes saved successfully!', 'success');
                } else {
                    showMessage('Error: ' + data.error, 'error');
                }
            })
            .catch(err => showMessage('Failed to save: ' + err.message, 'error'))
            .finally(() => {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save Changes';
            });
    });

    function showMessage(text, type) {
        statusMsg.textContent = text;
        statusMsg.className = `status-message ${type}`;
        setTimeout(() => {
            statusMsg.style.display = 'none';
        }, 3000);
    }
});
