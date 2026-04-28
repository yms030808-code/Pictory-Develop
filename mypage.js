document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('[data-mypage-tab]');
  const panels = document.querySelectorAll('[data-mypage-panel]');
  const logoutBtn = document.getElementById('mypageLogoutBtn');
  const sessionStorageKey = 'picoryAuthSession';
  const activityLogStorageKey = 'picoryActivityLogs';
  const archiveStorageKey = 'picoryArchivePosts';
  const communityStorageKey = 'picoryCommunityPosts';
  const nicknameEl = document.getElementById('mypageNickname');
  const timelineEl = document.getElementById('mypageTimeline');
  const archiveGridEl = document.getElementById('mypageArchiveGrid');
  const archiveCountEl = document.getElementById('mypageArchiveCount');
  const archivePanel = document.querySelector('[data-mypage-panel="archive"]');
  const archiveEmptyState = archivePanel?.querySelector('.mypage-empty-state');
  const archiveUploadZone = document.getElementById('mypageArchiveUploadZone');
  const archiveModelInput = document.getElementById('mypageArchiveModelInput');
  const archiveCategorySelect = document.getElementById('mypageArchiveCategorySelect');
  const archiveShareCommunity = document.getElementById('mypageArchiveShareCommunity');
  const archiveUploadBtn = document.getElementById('mypageArchiveUploadBtn');
  const archiveFileInput = document.createElement('input');
  archiveFileInput.type = 'file';
  archiveFileInput.accept = 'image/*';
  archiveFileInput.hidden = true;
  document.body.appendChild(archiveFileInput);
  const categoryLabelToKey = {
    인물: 'portrait',
    풍경: 'landscape',
    일상: 'daily',
    야경: 'night',
    음식: 'food',
  };
  const archiveUploadDefaultHtml = archiveUploadZone?.innerHTML || '';
  let archiveImageDataUrl = '';
  let archiveEditImageDataUrl = '';
  let archiveEditingId = '';
  let archiveEditOverlay = null;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.mypageTab;
      tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
      panels.forEach((panel) => {
        panel.classList.toggle('is-active', panel.dataset.mypagePanel === target);
      });
    });
  });

  const sessionRaw = localStorage.getItem(sessionStorageKey);
  if (nicknameEl && sessionRaw) {
    try {
      const session = JSON.parse(sessionRaw);
      if (session.nickname) nicknameEl.textContent = session.nickname;
    } catch (error) {
      /* noop */
    }
  }

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const escapeHtml = (value) =>
    String(value ?? '').replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[ch] || ch));

  const renderActivityLogs = () => {
    if (!timelineEl) return;
    const logsRaw = localStorage.getItem(activityLogStorageKey);
    let logs = [];
    try {
      logs = logsRaw ? JSON.parse(logsRaw) : [];
    } catch (error) {
      logs = [];
    }

    if (!logs.length) {
      timelineEl.innerHTML = '<li><span>안내</span>아직 기록된 활동 로그가 없습니다. 서비스를 사용하면 여기에 자동으로 쌓여요.</li>';
      return;
    }

    timelineEl.innerHTML = logs
      .slice(-12)
      .reverse()
      .map((log) => `<li><span>${formatTime(log.at)}</span>${log.message}</li>`)
      .join('');
  };

  renderActivityLogs();

  const renderArchive = () => {
    if (!archiveGridEl) return;
    const raw = localStorage.getItem(archiveStorageKey);
    let items = [];
    try {
      items = raw ? JSON.parse(raw) : [];
    } catch (_) {
      items = [];
    }

    if (archiveCountEl) {
      archiveCountEl.textContent = `${items.length}개`;
    }

    if (!items.length) {
      archiveGridEl.hidden = true;
      archiveGridEl.innerHTML = '';
      archiveEmptyState?.classList.remove('hidden');
      return;
    }

    archiveEmptyState?.classList.add('hidden');
    archiveGridEl.hidden = false;
    archiveGridEl.innerHTML = items
      .slice()
      .reverse()
      .map((item, reversedIdx, arr) => {
        const originalIndex = arr.length - 1 - reversedIdx;
        const id = String(item.id || '').trim();
        const safeId = escapeHtml(id);
        const model = escapeHtml(item.cameraModel || '업로드 이미지');
        const category = escapeHtml(item.categoryLabel || '');
        const imageSrc = String(item.imageDataUrl || '');
        return `
          <article class="mypage-archive-card card" data-archive-id="${safeId}" data-archive-index="${originalIndex}">
            <div class="mypage-archive-card__actions">
              <button type="button" class="btn btn--outline btn--xs" data-archive-edit="${safeId}" data-archive-index="${originalIndex}">수정</button>
              <button type="button" class="btn btn--danger btn--xs" data-archive-delete="${safeId}" data-archive-index="${originalIndex}">삭제</button>
            </div>
            <img src="${imageSrc}" alt="${model}">
            <p><strong>${model}</strong>${category ? ` · ${category}` : ''}</p>
          </article>
        `;
      })
      .join('');
  };
  function readArchiveList() {
    try {
      const raw = localStorage.getItem(archiveStorageKey);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (_) {
      return [];
    }
  }

  function writeArchiveList(list) {
    try {
      localStorage.setItem(archiveStorageKey, JSON.stringify(list.slice(-60)));
    } catch (_) {
      /* noop */
    }
  }

  function readCommunityList() {
    try {
      const raw = localStorage.getItem(communityStorageKey);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (_) {
      return [];
    }
  }

  function writeCommunityList(list) {
    try {
      localStorage.setItem(communityStorageKey, JSON.stringify(list.slice(-80)));
    } catch (_) {
      /* noop */
    }
  }

  function ensureArchiveEditOverlay() {
    if (archiveEditOverlay) return archiveEditOverlay;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay hidden';
    overlay.id = 'mypageArchiveEditModal';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal__header">
          <h3>아카이브 수정</h3>
          <button class="modal__close" type="button" data-archive-edit-close aria-label="닫기">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal__body">
          <div class="upload-modal-zone" id="archiveEditUploadZone" style="margin-bottom: 12px;">
            <p class="text-muted">사진을 클릭해서 교체할 수 있어요.</p>
          </div>
          <div class="form-group" style="margin-bottom: 10px;">
            <label class="form-label">카메라 기종</label>
            <input type="text" class="form-input" id="archiveEditModelInput" placeholder="예: Sony A7C II">
          </div>
          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label">카테고리</label>
            <select class="form-input" id="archiveEditCategorySelect">
              <option value="일상">일상</option>
              <option value="인물">인물</option>
              <option value="풍경">풍경</option>
              <option value="야경">야경</option>
              <option value="음식">음식</option>
            </select>
          </div>
          <div style="display:flex; gap:8px; justify-content:flex-end;">
            <button type="button" class="btn btn--outline btn--sm" data-archive-edit-cancel>취소</button>
            <button type="button" class="btn btn--primary btn--sm" data-archive-edit-save>저장</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.hidden = true;
    overlay.appendChild(fileInput);

    const zone = overlay.querySelector('#archiveEditUploadZone');
    zone?.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      const f = fileInput.files?.[0];
      if (!f) return;
      if (!f.type.startsWith('image/')) {
        alert('이미지 파일만 업로드할 수 있어요.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        archiveEditImageDataUrl = String(reader.result || '');
        zone.innerHTML = `<img src="${archiveEditImageDataUrl}" alt="수정 미리보기" style="width: 100%; max-height: 240px; object-fit: cover; border-radius: 12px;">`;
      };
      reader.readAsDataURL(f);
    });

    const close = () => {
      overlay.classList.add('hidden');
      archiveEditingId = '';
      archiveEditImageDataUrl = '';
      fileInput.value = '';
    };

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
    overlay.querySelector('[data-archive-edit-close]')?.addEventListener('click', close);
    overlay.querySelector('[data-archive-edit-cancel]')?.addEventListener('click', close);
    overlay.querySelector('[data-archive-edit-save]')?.addEventListener('click', () => {
      if (!archiveEditingId) return;
      const modelInput = overlay.querySelector('#archiveEditModelInput');
      const catSelect = overlay.querySelector('#archiveEditCategorySelect');
      const cameraModel = String(modelInput?.value || '').trim();
      if (!cameraModel) {
        alert('카메라 기종을 입력해 주세요.');
        modelInput?.focus();
        return;
      }
      const categoryLabel = String(catSelect?.value || '일상').trim() || '일상';

      const archiveList = readArchiveList();
      const idx = archiveList.findIndex((x) => x && x.id === archiveEditingId);
      if (idx < 0) {
        close();
        renderArchive();
        return;
      }
      const prev = archiveList[idx] || {};
      const next = {
        ...prev,
        cameraModel,
        categoryLabel,
        imageDataUrl: archiveEditImageDataUrl || prev.imageDataUrl,
        updatedAt: new Date().toISOString(),
      };
      archiveList[idx] = next;
      writeArchiveList(archiveList);

      // 커뮤니티에도 공유된 항목이면 같이 갱신(id 기준)
      const communityList = readCommunityList();
      const cIdx = communityList.findIndex((x) => x && x.id === archiveEditingId);
      if (cIdx >= 0) {
        const categoryKey = categoryLabelToKey[categoryLabel] || 'daily';
        communityList[cIdx] = {
          ...communityList[cIdx],
          cameraModel,
          categoryLabel,
          imageDataUrl: next.imageDataUrl,
          communityTags: `${categoryKey} daily`,
        };
        writeCommunityList(communityList);
      }

      addActivityLog(`${cameraModel} 아카이브 항목을 수정했어요.`);
      close();
      renderArchive();
      alert('수정 내용을 저장했어요.');
    });

    archiveEditOverlay = overlay;
    return overlay;
  }

  archiveGridEl?.addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-archive-edit]');
    const delBtn = e.target.closest('[data-archive-delete]');

    if (delBtn) {
      const id = String(delBtn.getAttribute('data-archive-delete') || '').trim();
      const indexRaw = delBtn.getAttribute('data-archive-index');
      const index = Number.parseInt(String(indexRaw ?? ''), 10);
      const list = readArchiveList();
      const item = id
        ? list.find((x) => x && x.id === id)
        : (Number.isInteger(index) ? list[index] : null);
      if (!item) return;
      const name = String(item?.cameraModel || '이 항목');
      if (!confirm('이 사진을 삭제하시겠습니까?')) return;
      const next = list.filter((x, i) => {
        if (!x) return false;
        if (id && String(x.id || '').trim()) return x.id !== id;
        return i !== index;
      });
      writeArchiveList(next);

      // 커뮤니티에 같은 id가 있으면 같이 삭제
      if (id) {
        const cList = readCommunityList();
        const cNext = cList.filter((x) => x && x.id !== id);
        if (cNext.length !== cList.length) writeCommunityList(cNext);
      }

      addActivityLog(`${name} 아카이브 항목을 삭제했어요.`);
      renderArchive();
      return;
    }

    if (editBtn) {
      const id = String(editBtn.getAttribute('data-archive-edit') || '').trim();
      const indexRaw = editBtn.getAttribute('data-archive-index');
      const index = Number.parseInt(String(indexRaw ?? ''), 10);
      const list = readArchiveList();
      const item = id
        ? list.find((x) => x && x.id === id)
        : (Number.isInteger(index) ? list[index] : null);
      if (!item) return;

      const overlay = ensureArchiveEditOverlay();
      // 예전 데이터(id 없음)도 수정 가능하도록 임시 id 부여 후 저장
      if (id) {
        archiveEditingId = id;
      } else if (Number.isInteger(index) && list[index]) {
        const fallbackId = `archive-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        list[index] = { ...list[index], id: fallbackId };
        writeArchiveList(list);
        archiveEditingId = fallbackId;
      } else {
        return;
      }
      archiveEditImageDataUrl = '';
      const zone = overlay.querySelector('#archiveEditUploadZone');
      zone.innerHTML = `<img src="${String(item.imageDataUrl || '')}" alt="현재 사진" style="width: 100%; max-height: 240px; object-fit: cover; border-radius: 12px;">`;
      overlay.querySelector('#archiveEditModelInput').value = String(item.cameraModel || '');
      overlay.querySelector('#archiveEditCategorySelect').value = String(item.categoryLabel || '일상');
      overlay.classList.remove('hidden');
      return;
    }
  });

  renderArchive();

  const setArchivePreview = (fileName, imageDataUrl) => {
    if (!archiveUploadZone) return;
    archiveUploadZone.innerHTML = `
      <img src="${imageDataUrl}" alt="아카이브 업로드 미리보기" style="width: 100%; max-height: 220px; object-fit: cover; border-radius: 12px;">
      <p><strong>${escapeHtml(fileName || '이미지')}</strong></p>
      <p class="text-muted">다른 사진으로 바꾸려면 클릭하거나 다시 드래그하세요.</p>
    `;
  };

  const handleArchiveImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있어요.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      archiveImageDataUrl = String(reader.result || '');
      setArchivePreview(file.name, archiveImageDataUrl);
    };
    reader.readAsDataURL(file);
  };

  archiveUploadZone?.addEventListener('click', () => archiveFileInput.click());
  archiveUploadZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    archiveUploadZone.classList.add('dragover');
  });
  archiveUploadZone?.addEventListener('dragleave', () => {
    archiveUploadZone.classList.remove('dragover');
  });
  archiveUploadZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    archiveUploadZone.classList.remove('dragover');
    handleArchiveImageFile(e.dataTransfer?.files?.[0]);
  });
  archiveFileInput.addEventListener('change', () => {
    handleArchiveImageFile(archiveFileInput.files?.[0]);
  });

  archiveUploadBtn?.addEventListener('click', () => {
    if (!archiveImageDataUrl) {
      alert('아카이브에 올릴 사진을 먼저 선택해 주세요.');
      return;
    }
    const cameraModel = archiveModelInput?.value?.trim();
    if (!cameraModel) {
      alert('카메라 기종을 입력해 주세요.');
      archiveModelInput?.focus();
      return;
    }

    const categoryLabel = archiveCategorySelect?.value?.trim() || '일상';
    const categoryKey = categoryLabelToKey[categoryLabel] || 'daily';
    let authorHandle = '@게스트';
    try {
      const raw = localStorage.getItem(sessionStorageKey);
      const session = raw ? JSON.parse(raw) : null;
      if (session?.nickname) authorHandle = `@${String(session.nickname).trim() || '게스트'}`;
    } catch (_) {
      /* noop */
    }

    const shouldShareToCommunity = Boolean(archiveShareCommunity?.checked);

    const archiveItem = {
      id: `archive-${Date.now()}`,
      imageDataUrl: archiveImageDataUrl,
      cameraModel,
      categoryLabel,
      sharedToCommunity: shouldShareToCommunity,
      aperture: '-',
      shutterSpeed: '-',
      iso: '-',
      focalLength: '-',
      authorHandle,
      createdAt: new Date().toISOString(),
    };

    try {
      const raw = localStorage.getItem(archiveStorageKey);
      const list = raw ? JSON.parse(raw) : [];
      list.push(archiveItem);
      localStorage.setItem(archiveStorageKey, JSON.stringify(list.slice(-60)));
    } catch (_) {
      /* noop */
    }

    if (shouldShareToCommunity) {
      try {
        const raw = localStorage.getItem(communityStorageKey);
        const list = raw ? JSON.parse(raw) : [];
        list.push({
          ...archiveItem,
          communityTags: `${categoryKey} daily`,
          likes: Math.floor(Math.random() * 60) + 1,
        });
        localStorage.setItem(communityStorageKey, JSON.stringify(list.slice(-80)));
      } catch (_) {
        /* noop */
      }
    }

    renderArchive();
    addActivityLog(
      shouldShareToCommunity
        ? `${cameraModel} 사진을 아카이브에 저장하고 커뮤니티에도 올렸어요.`
        : `${cameraModel} 사진을 아카이브에 저장했어요.`,
    );

    if (archiveUploadZone) archiveUploadZone.innerHTML = archiveUploadDefaultHtml;
    archiveImageDataUrl = '';
    archiveFileInput.value = '';
    if (archiveModelInput) archiveModelInput.value = '';
    if (archiveCategorySelect) archiveCategorySelect.value = '일상';
    if (archiveShareCommunity) archiveShareCommunity.checked = false;
    alert(
      shouldShareToCommunity
        ? '아카이브에 저장하고 커뮤니티에도 업로드했어요.'
        : '아카이브에 저장했어요.',
    );
  });

  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem(sessionStorageKey);
    window.location.href = 'index.html';
  });
});
