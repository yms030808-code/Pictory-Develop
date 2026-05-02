document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('[data-mypage-tab]');
  const panels = document.querySelectorAll('[data-mypage-panel]');
  const logoutBtn = document.getElementById('mypageLogoutBtn');
  const profileOpenSettingsEl = document.querySelector('.mypage-profile--opens-settings');
  const sessionStorageKey = 'picoryAuthSession';
  const activityLogStorageKey = 'picoryActivityLogs';
  const recentCameraStorageKey = 'picoryRecentCameras';
  const bookmarkStorageKey = 'picoryBookmarks';
  const archiveStorageKey = 'picoryArchivePosts';
  const communityStorageKey = 'picoryCommunityPosts';
  const nicknameEl = document.getElementById('mypageNickname');
  const profileSubEl = document.getElementById('mypageProfileSub');
  const recentCameraListEl = document.getElementById('mypageRecentCameraList');
  const bookmarkGridEl = document.getElementById('mypageBookmarkGrid');
  const bookmarkEmptyEl = document.getElementById('mypageBookmarkEmpty');
  const bookmarkCompareEl = document.getElementById('mypageBookmarkCompare');
  const bookmarkCompareChoicesEl = document.getElementById('mypageBookmarkCompareChoices');
  const bookmarkCompareResultEl = document.getElementById('mypageBookmarkCompareResult');
  const bookmarkCompareBtn = document.getElementById('mypageBookmarkCompareBtn');
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
  const cameraCompareCatalog = [
    { name: 'Fujifilm X100VI', sensor: 'APS-C', price: '약 2,190,000원대', feature: '필름 시뮬레이션, 스냅 고정렌즈', bestFor: '일상·스냅·감성 사진', weight: '컴팩트' },
    { name: 'Canon EOS R10', sensor: 'APS-C', price: '약 920,000원대', feature: '빠른 반응성, 입문 친화 조작', bestFor: '입문·여행·가성비', weight: '가벼움' },
    { name: 'Sony ZV-E10 II', sensor: 'APS-C', price: '약 1,280,000원대', feature: '브이로그 자동 모드, 마이크 단자', bestFor: '영상·브이로그', weight: '가벼움' },
    { name: 'Ricoh GR IIIx', sensor: 'APS-C', price: '약 1,590,000원대', feature: '40mm 스냅 특화 포켓 카메라', bestFor: '여행·거리 스냅', weight: '매우 가벼움' },
    { name: 'Sony A7C II', sensor: '풀프레임', price: '약 2,390,000원대', feature: '작은 바디 + 풀프레임 센서', bestFor: '인물·여행·올라운드', weight: '중간' },
    { name: 'Nikon Z fc', sensor: 'APS-C', price: '약 1,190,000원대', feature: '레트로 디자인, 다이얼 조작', bestFor: '감성·일상·여행', weight: '가벼움' },
    { name: 'Canon PowerShot G7 X Mark III', sensor: '1인치', price: '약 950,000원대', feature: '컴팩트 4K 영상, 휴대성', bestFor: '브이로그·일상', weight: '매우 가벼움' },
    { name: 'DJI Osmo Pocket 3', sensor: '1인치', price: '약 649,000원대', feature: '3축 짐벌 손떨림 보정', bestFor: '영상·여행 브이로그', weight: '초경량' },
    { name: 'Sony A6700', sensor: 'APS-C', price: '약 1,520,000원대', feature: '빠른 AF, 고급 영상 옵션', bestFor: '영상·사진 올라운드', weight: '중간' },
    { name: 'Canon EOS R50', sensor: 'APS-C', price: '약 980,000원대', feature: '쉬운 조작, 입문형 미러리스', bestFor: '입문·일상', weight: '가벼움' },
    { name: 'Fujifilm X-S20', sensor: 'APS-C', price: '약 1,780,000원대', feature: '손떨림 보정, 배터리 효율', bestFor: '사진·영상 겸용', weight: '중간' },
    { name: 'Canon EOS R50 V', sensor: 'APS-C', price: '약 1,180,000원대', feature: '세로 영상·라이브 친화 UI', bestFor: '브이로그·숏폼', weight: '가벼움' },
  ];

  function activateTab(target) {
    if (!target) return;
    const matchedTab = Array.from(tabs).find((tab) => tab.dataset.mypageTab === target);
    const matchedPanel = Array.from(panels).find((panel) => panel.dataset.mypagePanel === target);
    if (!matchedTab || !matchedPanel) return;

    tabs.forEach((tab) => tab.classList.toggle('is-active', tab === matchedTab));
    panels.forEach((panel) => {
      panel.classList.toggle('is-active', panel === matchedPanel);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activateTab(tab.dataset.mypageTab);
    });
  });
  const requestedTab = new URLSearchParams(window.location.search).get('tab');
  const requestedHash = window.location.hash.replace('#', '');
  const initialTab = requestedTab || (requestedHash === 'bookmarks' ? 'bookmark' : requestedHash);
  if (initialTab) {
    activateTab(initialTab);
    if (requestedHash) {
      window.requestAnimationFrame(() => {
        document.getElementById(requestedHash)?.scrollIntoView({ block: 'start' });
      });
    }
  }

  profileOpenSettingsEl?.addEventListener('click', (event) => {
    const t = event.target;
    if (!(t instanceof Element)) return;
    if (t.closest('#mypageLogoutBtn')) return;
    activateTab('settings');
  });

  const sessionRaw = localStorage.getItem(sessionStorageKey);
  if (sessionRaw) {
    try {
      const session = JSON.parse(sessionRaw);
      if (nicknameEl && session.nickname) nicknameEl.textContent = session.nickname;
      if (profileSubEl) {
        profileSubEl.textContent = session.id ? `아이디 ${session.id}` : '';
      }
    } catch (error) {
      /* noop */
    }
  } else if (profileSubEl) {
    profileSubEl.textContent = '로그인하면 계정 정보가 표시돼요.';
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

  const normalizeCameraName = (value) =>
    String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

  const findCompareMeta = (name) => {
    const key = normalizeCameraName(name);
    return cameraCompareCatalog.find((item) => normalizeCameraName(item.name) === key) ||
      cameraCompareCatalog.find((item) => key.includes(normalizeCameraName(item.name)) || normalizeCameraName(item.name).includes(key));
  };

  const addActivityLog = (message) => {
    try {
      const raw = localStorage.getItem(activityLogStorageKey);
      const logs = raw ? JSON.parse(raw) : [];
      logs.push({
        at: new Date().toISOString(),
        message: String(message || '').trim(),
      });
      localStorage.setItem(activityLogStorageKey, JSON.stringify(logs.slice(-80)));
    } catch (_) {
      /* noop */
    }
  };

  const syncSidebarStats = () => {
    let bookmarks = 0;
    let archive = 0;
    let recent = 0;
    try {
      const bRaw = localStorage.getItem(bookmarkStorageKey);
      const bList = bRaw ? JSON.parse(bRaw) : [];
      if (Array.isArray(bList)) bookmarks = bList.filter((item) => item?.name).length;
    } catch (_) {
      /* noop */
    }
    try {
      const aRaw = localStorage.getItem(archiveStorageKey);
      const aList = aRaw ? JSON.parse(aRaw) : [];
      if (Array.isArray(aList)) archive = aList.length;
    } catch (_) {
      /* noop */
    }
    try {
      const rRaw = localStorage.getItem(recentCameraStorageKey);
      const rList = rRaw ? JSON.parse(rRaw) : [];
      if (Array.isArray(rList)) recent = rList.length;
    } catch (_) {
      /* noop */
    }
    const elBm = document.getElementById('mypageStatBookmarks');
    const elAr = document.getElementById('mypageStatArchive');
    const elRc = document.getElementById('mypageStatRecent');
    if (elBm) elBm.textContent = String(bookmarks);
    if (elAr) elAr.textContent = String(archive);
    if (elRc) elRc.textContent = String(recent);
  };

  const readRecentCameras = () => {
    try {
      const raw = localStorage.getItem(recentCameraStorageKey);
      const list = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) return [];
      return list.slice().reverse();
    } catch (_) {
      return [];
    }
  };

  const renderRecentCameras = () => {
    if (!recentCameraListEl) return;
    const items = readRecentCameras();
    if (!items.length) {
      recentCameraListEl.innerHTML = '<li class="mypage-recent-camera-list__empty">최근 본 카메라가 아직 없습니다. 상품을 클릭하거나 검색하면 여기에 표시됩니다.</li>';
      syncSidebarStats();
      return;
    }
    recentCameraListEl.innerHTML = items
      .slice(0, 12)
      .map((item) => {
        const name = escapeHtml(item?.name || '카메라');
        const query = encodeURIComponent(String(item?.query || item?.name || '').trim());
        const source = escapeHtml(item?.source || '클릭');
        const at = formatTime(item?.at);
        return `
          <li>
            <a class="mypage-recent-camera-list__link" href="price.html?q=${query}">
              <strong>${name}</strong>
              <span>${source}${at ? ` · ${at}` : ''}</span>
            </a>
          </li>
        `;
      })
      .join('');
    syncSidebarStats();
  };

  const readBookmarks = () => {
    try {
      const raw = localStorage.getItem(bookmarkStorageKey);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list.filter((item) => item?.name) : [];
    } catch (_) {
      return [];
    }
  };

  const renderBookmarks = () => {
    if (!bookmarkGridEl) return;
    const items = readBookmarks();
    if (!items.length) {
      bookmarkGridEl.hidden = true;
      bookmarkGridEl.innerHTML = '';
      bookmarkEmptyEl?.classList.remove('hidden');
      if (bookmarkCompareEl) bookmarkCompareEl.hidden = true;
      syncSidebarStats();
      return;
    }

    bookmarkEmptyEl?.classList.add('hidden');
    bookmarkGridEl.hidden = false;
    if (bookmarkCompareEl) bookmarkCompareEl.hidden = false;
    bookmarkGridEl.innerHTML = items
      .map((item, index) => ({ item, index }))
      .reverse()
      .map(({ item, index }) => {
        const name = escapeHtml(item.name || '카메라');
        const lens = escapeHtml(item.lens || '북마크');
        const price = escapeHtml(item.price || '');
        const href = escapeHtml(item.href || `price.html?q=${encodeURIComponent(item.name || '')}`);
        return `
          <article class="mypage-bookmark-card card">
            <div>
              <strong>${name}</strong>
              <p>${lens}${price ? ` · ${price}` : ''}</p>
            </div>
            <div class="mypage-bookmark-card__actions">
              <a class="btn btn--outline btn--xs" href="${href}">시세 보기</a>
              <button type="button" class="mypage-bookmark-card__remove" data-bookmark-remove="${index}" aria-label="${name} 북마크 해제">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              </button>
            </div>
          </article>
        `;
      })
      .join('');
    renderBookmarkCompareChoices(items);
    syncSidebarStats();
  };

  renderBookmarks();

  bookmarkGridEl?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const removeBtn = target.closest('[data-bookmark-remove]');
    if (!removeBtn) return;
    const index = Number(removeBtn.dataset.bookmarkRemove);
    const bmItems = readBookmarks();
    if (!Number.isInteger(index) || !bmItems[index]) return;

    bmItems.splice(index, 1);
    localStorage.setItem(bookmarkStorageKey, JSON.stringify(bmItems));
    renderBookmarks();
    window.syncPicoryBookmarks?.();
  });

  function buildCompareItem(bookmark) {
    const meta = findCompareMeta(bookmark.name) || {};
    return {
      name: bookmark.name || '카메라',
      price: bookmark.price || meta.price || '가격 정보 없음',
      sensor: meta.sensor || '정보 준비 중',
      feature: meta.feature || bookmark.lens || '북마크한 카메라',
      bestFor: meta.bestFor || '시세 비교에서 확인',
      weight: meta.weight || '정보 준비 중',
      href: bookmark.href || `price.html?q=${encodeURIComponent(bookmark.name || '')}`,
    };
  }

  function renderBookmarkCompareChoices(items) {
    if (!bookmarkCompareChoicesEl) return;
    bookmarkCompareChoicesEl.innerHTML = items
      .map((item, index) => `
        <label class="mypage-bookmark-compare__choice">
          <input type="checkbox" value="${index}" ${index < 2 ? 'checked' : ''}>
          <span>${escapeHtml(item.name)}</span>
        </label>
      `)
      .join('');
    renderBookmarkComparison();
  }

  function renderBookmarkComparison() {
    if (!bookmarkCompareChoicesEl || !bookmarkCompareResultEl) return;
    const bookmarks = readBookmarks();
    const checkedInputs = Array.from(bookmarkCompareChoicesEl.querySelectorAll('input:checked'));
    if (checkedInputs.length > 4) {
      bookmarkCompareResultEl.innerHTML = '<p class="mypage-muted">비교는 최대 4개 카메라까지만 선택할 수 있어요.</p>';
      return;
    }

    const selected = checkedInputs
      .map((input) => bookmarks[Number(input.value)])
      .filter(Boolean);

    if (selected.length < 2) {
      bookmarkCompareResultEl.innerHTML = '<p class="mypage-muted">비교할 카메라를 2개 이상 선택해 주세요.</p>';
      return;
    }

    const rows = selected.map(buildCompareItem);
    bookmarkCompareResultEl.innerHTML = `
      <div class="mypage-bookmark-compare-table">
        ${rows.map((item) => `
          <article class="mypage-bookmark-compare-card">
            <h4>${escapeHtml(item.name)}</h4>
            <dl>
              <div><dt>가격</dt><dd>${escapeHtml(item.price)}</dd></div>
              <div><dt>센서</dt><dd>${escapeHtml(item.sensor)}</dd></div>
              <div><dt>특징</dt><dd>${escapeHtml(item.feature)}</dd></div>
              <div><dt>추천 용도</dt><dd>${escapeHtml(item.bestFor)}</dd></div>
              <div><dt>휴대성</dt><dd>${escapeHtml(item.weight)}</dd></div>
            </dl>
            <a class="btn btn--outline btn--xs" href="${escapeHtml(item.href)}">시세 보기</a>
          </article>
        `).join('')}
      </div>
    `;
  }

  bookmarkCompareBtn?.addEventListener('click', renderBookmarkComparison);
  bookmarkCompareChoicesEl?.addEventListener('change', (event) => {
    const checkedInputs = Array.from(bookmarkCompareChoicesEl.querySelectorAll('input:checked'));
    if (checkedInputs.length > 4) {
      if (event.target instanceof HTMLInputElement) {
        event.target.checked = false;
      }
      alert('비교는 최대 4개 카메라까지만 선택할 수 있어요.');
    }
    renderBookmarkComparison();
  });

  renderRecentCameras();
  syncSidebarStats();

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
    syncSidebarStats();

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
      .map((item) => {
        const model = escapeHtml(item.cameraModel || '업로드 이미지');
        const category = escapeHtml(item.categoryLabel || '');
        const imageSrc = String(item.imageDataUrl || '');
        return `
          <article class="mypage-archive-card card">
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
