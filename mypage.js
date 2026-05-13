document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('[data-mypage-tab]');
  const panels = document.querySelectorAll('[data-mypage-panel]');
  const logoutBtn = document.getElementById('mypageLogoutBtn');
  const profileOpenSettingsEl = document.querySelector('.mypage-profile--opens-settings');
  const sessionStorageKey = 'picoryAuthSession';
  const userStorageKey = 'picoryAuthDemoUser';
  const profileAvatarStorageKey = 'picoryProfileAvatar';
  const accountPrefsStorageKey = 'picoryAccountPrefs';
  const activityLogStorageKey = 'picoryActivityLogs';
  const recentCameraStorageKey = 'picoryRecentCameras';
  const bookmarkStorageKey = 'picoryBookmarks';
  const archiveStorageKey = 'picoryArchivePosts';
  const communityStorageKey = 'picoryCommunityPosts';
  const communityLikesStorageKey = 'picoryCommunityLikes';
  const communityCommentsStorageKey = 'picoryCommunityComments';
  const nicknameEl = document.getElementById('mypageNickname');
  const profileSubEl = document.getElementById('mypageProfileSub');
  const profileAvatarImg = document.getElementById('mypageProfileAvatarImg');
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
  const communityPanel = document.querySelector('[data-mypage-panel="community"]');
  const communityEmptyState = communityPanel?.querySelector('.mypage-empty-state');
  const communityActivityEl = document.getElementById('mypageCommunityActivity');
  const likedPostsListEl = document.getElementById('mypageLikedPostsList');
  const commentsListEl = document.getElementById('mypageCommentsList');
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

  const settingsSectionRoot = document.querySelector('[data-mypage-panel="settings"]');
  const settingsTabs = settingsSectionRoot?.querySelectorAll('[data-settings-tab]');
  const settingsPanels = settingsSectionRoot?.querySelectorAll('[data-settings-panel]');

  function activateSettingsTab(target) {
    if (!target || !settingsTabs?.length || !settingsPanels?.length) return;
    settingsTabs.forEach((tab) => {
      tab.classList.toggle('is-active', tab.dataset.settingsTab === target);
    });
    settingsPanels.forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.settingsPanel === target);
    });
  }

  settingsTabs?.forEach((tab) => {
    tab.addEventListener('click', () => activateSettingsTab(tab.dataset.settingsTab));
  });

  const sessionRaw = localStorage.getItem(sessionStorageKey);
  let currentUser = { id: 'guest', nickname: '게스트' };
  if (sessionRaw) {
    try {
      const session = JSON.parse(sessionRaw);
      if (nicknameEl && session.nickname) nicknameEl.textContent = session.nickname;
      if (profileSubEl) {
        const rawId = String(session.id || '').trim();
        profileSubEl.textContent = rawId ? `@${rawId.replace(/^@+/, '')}` : '';
      }
      currentUser = {
        id: String(session.id || session.nickname || 'member'),
        nickname: String(session.nickname || session.id || '회원'),
      };
    } catch (error) {
      /* noop */
    }
  } else if (profileSubEl) {
    profileSubEl.textContent = '로그인하면 계정 정보가 표시돼요.';
  }

  try {
    const avStore = localStorage.getItem(profileAvatarStorageKey);
    if (profileAvatarImg && avStore && avStore.startsWith('data:image/')) {
      profileAvatarImg.src = avStore;
    }
  } catch (_) {
    /* noop */
  }

  const settingsAvatarPreviewEl = document.getElementById('settingsAvatarPreview');
  if (profileAvatarImg && !profileAvatarImg.dataset.avatarFallbackSrc) {
    profileAvatarImg.dataset.avatarFallbackSrc = profileAvatarImg.getAttribute('src') || '';
  }
  if (settingsAvatarPreviewEl && !settingsAvatarPreviewEl.dataset.avatarFallbackSrc) {
    settingsAvatarPreviewEl.dataset.avatarFallbackSrc = settingsAvatarPreviewEl.getAttribute('src') || '';
  }
  if (settingsAvatarPreviewEl && profileAvatarImg) {
    settingsAvatarPreviewEl.src = profileAvatarImg.src;
  }

  const isLoggedIn = Boolean(sessionRaw);

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

  const readJsonList = (key) => {
    try {
      const raw = localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (_) {
      return [];
    }
  };

  const renderCommunityActivity = () => {
    if (!communityActivityEl || !likedPostsListEl || !commentsListEl) return;
    const likedPosts = readJsonList(communityLikesStorageKey)
      .filter((item) => item?.userId === currentUser.id)
      .slice()
      .reverse();
    const comments = readJsonList(communityCommentsStorageKey)
      .filter((item) => item?.userId === currentUser.id)
      .slice()
      .reverse();

    const hasActivity = likedPosts.length > 0 || comments.length > 0;
    communityActivityEl.hidden = !hasActivity;
    communityEmptyState?.classList.toggle('hidden', hasActivity);

    likedPostsListEl.innerHTML = likedPosts.length
      ? likedPosts.map((item) => `
        <article class="mypage-community-photo-card card">
          <a href="community.html" class="mypage-community-photo-card__link" aria-label="${escapeHtml(item.cameraModel || '커뮤니티 사진')} 게시글 보러가기">
            <div class="mypage-community-photo-card__img">
              <img src="${String(item.imageSrc || '')}" alt="${escapeHtml(item.imageAlt || item.cameraModel || '좋아요한 게시글')}" loading="lazy">
            </div>
            <div class="mypage-community-photo-card__info">
              <strong>${escapeHtml(item.cameraModel || '커뮤니티 사진')}</strong>
              <span>${escapeHtml(item.authorHandle || '@guest')} · ${formatTime(item.likedAt)}</span>
            </div>
          </a>
        </article>
      `).join('')
      : '<p class="mypage-muted">아직 좋아요한 게시물이 없어요.</p>';

    commentsListEl.innerHTML = comments.length
      ? comments.map((item) => `
        <article class="mypage-community-item mypage-community-item--comment">
          <img src="${String(item.imageSrc || '')}" alt="${escapeHtml(item.imageAlt || item.cameraModel || '댓글을 남긴 게시글')}" loading="lazy">
          <div>
            <strong>${escapeHtml(item.cameraModel || '커뮤니티 사진')}</strong>
            <blockquote>${escapeHtml(item.text || '')}</blockquote>
            <p>${escapeHtml(item.authorHandle || '@guest')} 게시글 · ${formatTime(item.createdAt)}</p>
          </div>
        </article>
      `).join('')
      : '<p class="mypage-muted">아직 작성한 댓글이 없어요.</p>';
  };

  /** 이전 사이드바 활동 요약(북마크·아카이브 등) 제거 후 호환용 noop */
  const syncSidebarStats = () => {};

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
  renderCommunityActivity();
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

  const settingsGuestNotice = document.getElementById('settingsGuestNotice');
  const settingsPanelsRoot = settingsSectionRoot?.querySelector('.mypage-settings-panels');
  const settingsAvatarFile = document.getElementById('settingsAvatarFile');
  const settingsAvatarPickBtn = document.getElementById('settingsAvatarPickBtn');
  const settingsAvatarClearBtn = document.getElementById('settingsAvatarClearBtn');
  const settingsDisplayNameInput = document.getElementById('settingsDisplayNameInput');
  const settingsSaveDisplayNameBtn = document.getElementById('settingsSaveDisplayNameBtn');
  const settingsAccountIdInput = document.getElementById('settingsAccountIdInput');
  const settingsSaveIdBtn = document.getElementById('settingsSaveIdBtn');
  const settingsCurrentPassword = document.getElementById('settingsCurrentPassword');
  const settingsNewPassword = document.getElementById('settingsNewPassword');
  const settingsNewPasswordConfirm = document.getElementById('settingsNewPasswordConfirm');
  const settingsSavePasswordBtn = document.getElementById('settingsSavePasswordBtn');
  const settingsEmailInput = document.getElementById('settingsEmailInput');
  const settingsSaveEmailBtn = document.getElementById('settingsSaveEmailBtn');
  const settingsRemoveEmailBtn = document.getElementById('settingsRemoveEmailBtn');
  const settingsDeleteAccountBtn = document.getElementById('settingsDeleteAccountBtn');
  const settingsPriceEmailNotify = document.getElementById('settingsPriceEmailNotify');
  const settingsNotifyEmailHint = document.getElementById('settingsNotifyEmailHint');

  function readAccountPrefs() {
    try {
      const raw = localStorage.getItem(accountPrefsStorageKey);
      const o = raw ? JSON.parse(raw) : {};
      return {
        linkedEmail: typeof o.linkedEmail === 'string' ? o.linkedEmail.trim() : '',
        emailNotifyPrice: Boolean(o.emailNotifyPrice),
      };
    } catch (_) {
      return { linkedEmail: '', emailNotifyPrice: false };
    }
  }

  function writeAccountPrefs(prefs) {
    localStorage.setItem(accountPrefsStorageKey, JSON.stringify(prefs));
  }

  function syncAvatarPreviewFromSidebar() {
    const preview = document.getElementById('settingsAvatarPreview');
    if (preview && profileAvatarImg) preview.src = profileAvatarImg.src;
  }

  function avatarFallbackSrc() {
    return (
      profileAvatarImg?.dataset.avatarFallbackSrc ||
      settingsAvatarPreviewEl?.dataset.avatarFallbackSrc ||
      ''
    );
  }

  function applyDefaultAvatar() {
    const fb = avatarFallbackSrc();
    if (profileAvatarImg && fb) profileAvatarImg.src = fb;
    syncAvatarPreviewFromSidebar();
  }

  function updateEmailLinkedUi(prefs) {
    const linked = Boolean(prefs.linkedEmail);
    settingsRemoveEmailBtn?.classList.toggle('hidden', !linked);
  }

  function refreshNotifyHint(prefs) {
    if (!settingsNotifyEmailHint) return;
    if (!prefs.emailNotifyPrice) {
      settingsNotifyEmailHint.textContent = '';
      return;
    }
    if (!prefs.linkedEmail) {
      settingsNotifyEmailHint.textContent =
        '이메일 알림을 받으려면 계정 탭에서 이메일을 연결해 주세요.';
      return;
    }
    settingsNotifyEmailHint.textContent = `알림 수신 주소: ${prefs.linkedEmail}`;
  }

  function loadDemoUser() {
    try {
      const raw = localStorage.getItem(userStorageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function persistSessionPatch(patch) {
    const raw = localStorage.getItem(sessionStorageKey);
    if (!raw) return null;
    try {
      const session = JSON.parse(raw);
      Object.assign(session, patch);
      localStorage.setItem(sessionStorageKey, JSON.stringify(session));
      return session;
    } catch (_) {
      return null;
    }
  }

  function validateEmail(text) {
    const s = String(text || '').trim();
    if (!s) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  }

  function bindSettingsPasswordToggles() {
    settingsSectionRoot?.querySelectorAll('[data-password-toggle]').forEach((toggleButton) => {
      toggleButton.addEventListener('click', () => {
        const row = toggleButton.parentElement;
        const input = row?.querySelector('input');
        if (!(input instanceof HTMLInputElement)) return;
        const reveal = input.type === 'password';
        input.type = reveal ? 'text' : 'password';
        toggleButton.setAttribute('aria-label', reveal ? '비밀번호 숨기기' : '비밀번호 보기 전환');
      });
    });
  }

  const AVATAR_CROP_VIEWPORT = 260;
  const AVATAR_CROP_EXPORT = 384;
  const avatarCropModal = document.getElementById('avatarCropModal');
  const avatarCropViewport = document.getElementById('avatarCropViewport');
  const avatarCropImage = document.getElementById('avatarCropImage');
  const avatarCropZoomInput = document.getElementById('avatarCropZoom');
  const avatarCropCancelBtn = document.getElementById('avatarCropCancel');
  const avatarCropApplyBtn = document.getElementById('avatarCropApply');

  let avatarCropNw = 0;
  let avatarCropNh = 0;
  let avatarCropPanX = 0;
  let avatarCropPanY = 0;
  let avatarCropDrag = null;

  function avatarCropCoverScale() {
    if (!avatarCropNw || !avatarCropNh) return 1;
    const zoomPct = Number(avatarCropZoomInput?.value) || 100;
    return Math.max(AVATAR_CROP_VIEWPORT / avatarCropNw, AVATAR_CROP_VIEWPORT / avatarCropNh) * (zoomPct / 100);
  }

  function layoutAvatarCropImage() {
    if (!avatarCropImage || !avatarCropNw) return;
    const V = AVATAR_CROP_VIEWPORT;
    const s = avatarCropCoverScale();
    const rw = avatarCropNw * s;
    const rh = avatarCropNh * s;
    avatarCropImage.style.width = `${rw}px`;
    avatarCropImage.style.height = `${rh}px`;
    avatarCropImage.style.left = `${(V - rw) / 2 + avatarCropPanX}px`;
    avatarCropImage.style.top = `${(V - rh) / 2 + avatarCropPanY}px`;
  }

  function clampAvatarCropPan() {
    const V = AVATAR_CROP_VIEWPORT;
    const s = avatarCropCoverScale();
    const rw = avatarCropNw * s;
    const rh = avatarCropNh * s;
    const maxX = Math.max(0, (rw - V) / 2);
    const maxY = Math.max(0, (rh - V) / 2);
    avatarCropPanX = Math.min(maxX, Math.max(-maxX, avatarCropPanX));
    avatarCropPanY = Math.min(maxY, Math.max(-maxY, avatarCropPanY));
  }

  function closeAvatarCropModal() {
    if (!avatarCropModal) return;
    avatarCropModal.hidden = true;
    document.body.style.overflow = '';
    avatarCropModal.setAttribute('aria-hidden', 'true');
    avatarCropDrag = null;
    if (avatarCropImage) {
      avatarCropImage.onload = null;
      avatarCropImage.onerror = null;
      avatarCropImage.removeAttribute('src');
    }
    avatarCropNw = 0;
    avatarCropNh = 0;
  }

  function openAvatarCropModal(dataUrl) {
    if (!avatarCropModal || !avatarCropImage) return;
    avatarCropPanX = 0;
    avatarCropPanY = 0;
    if (avatarCropZoomInput) avatarCropZoomInput.value = '100';

    avatarCropImage.onload = () => {
      avatarCropNw = avatarCropImage.naturalWidth;
      avatarCropNh = avatarCropImage.naturalHeight;
      if (!avatarCropNw || !avatarCropNh) {
        alert('이 이미지 형식은 자르기를 지원하지 않아요. JPG·PNG 등을 사용해 주세요.');
        closeAvatarCropModal();
        return;
      }
      clampAvatarCropPan();
      layoutAvatarCropImage();
      avatarCropModal.hidden = false;
      avatarCropModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    avatarCropImage.onerror = () => {
      alert('이미지를 불러오지 못했습니다.');
      closeAvatarCropModal();
    };

    avatarCropImage.src = dataUrl;
  }

  function exportAvatarCropDataUrl() {
    if (!avatarCropImage || !avatarCropNw || !avatarCropNh) return '';
    const V = AVATAR_CROP_VIEWPORT;
    const OUT = AVATAR_CROP_EXPORT;
    const s = avatarCropCoverScale();
    const rw = avatarCropNw * s;
    const rh = avatarCropNh * s;
    const L = (V - rw) / 2 + avatarCropPanX;
    const T = (V - rh) / 2 + avatarCropPanY;
    const canvas = document.createElement('canvas');
    canvas.width = OUT;
    canvas.height = OUT;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    const scale = OUT / V;
    ctx.save();
    ctx.scale(scale, scale);
    ctx.beginPath();
    ctx.arc(V / 2, V / 2, V / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatarCropImage, L, T, rw, rh);
    ctx.restore();
    try {
      return canvas.toDataURL('image/jpeg', 0.88);
    } catch (_) {
      return '';
    }
  }

  function initAvatarCropModal() {
    if (!avatarCropViewport || !avatarCropImage) return;

    avatarCropViewport.addEventListener('pointerdown', (e) => {
      if (!avatarCropModal || avatarCropModal.hidden || e.button !== 0) return;
      e.preventDefault();
      avatarCropDrag = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        origPanX: avatarCropPanX,
        origPanY: avatarCropPanY,
      };
      try {
        avatarCropViewport.setPointerCapture(e.pointerId);
      } catch (_) {
        /* noop */
      }
      avatarCropViewport.style.cursor = 'grabbing';
    });

    avatarCropViewport.addEventListener('pointermove', (e) => {
      if (!avatarCropDrag || e.pointerId !== avatarCropDrag.pointerId) return;
      const dx = e.clientX - avatarCropDrag.startX;
      const dy = e.clientY - avatarCropDrag.startY;
      avatarCropPanX = avatarCropDrag.origPanX + dx;
      avatarCropPanY = avatarCropDrag.origPanY + dy;
      clampAvatarCropPan();
      layoutAvatarCropImage();
    });

    const endAvatarCropDrag = (e) => {
      if (!avatarCropDrag || e.pointerId !== avatarCropDrag.pointerId) return;
      avatarCropDrag = null;
      avatarCropViewport.style.cursor = 'grab';
      try {
        avatarCropViewport.releasePointerCapture(e.pointerId);
      } catch (_) {
        /* noop */
      }
    };

    avatarCropViewport.addEventListener('pointerup', endAvatarCropDrag);
    avatarCropViewport.addEventListener('pointercancel', endAvatarCropDrag);

    avatarCropZoomInput?.addEventListener('input', () => {
      clampAvatarCropPan();
      layoutAvatarCropImage();
    });

    avatarCropCancelBtn?.addEventListener('click', () => closeAvatarCropModal());

    avatarCropApplyBtn?.addEventListener('click', () => {
      const out = exportAvatarCropDataUrl();
      if (!out) {
        alert('이미지를 저장할 수 없어요.');
        return;
      }
      try {
        localStorage.setItem(profileAvatarStorageKey, out);
      } catch (_) {
        alert('저장 공간이 부족할 수 있어요. 확대를 줄이거나 더 작은 원본을 선택해 주세요.');
        return;
      }
      if (profileAvatarImg) profileAvatarImg.src = out;
      syncAvatarPreviewFromSidebar();
      addActivityLog('프로필 이미지를 변경했어요.');
      closeAvatarCropModal();
    });

    avatarCropModal?.addEventListener('click', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest('[data-avatar-crop-dismiss]')) closeAvatarCropModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || !avatarCropModal || avatarCropModal.hidden) return;
      closeAvatarCropModal();
    });
  }

  function initAccountSettingsUi() {
    if (!settingsSectionRoot) return;

    settingsGuestNotice?.classList.toggle('hidden', isLoggedIn);

    const prefs = readAccountPrefs();
    const demoUser = loadDemoUser();

    if (settingsAccountIdInput) {
      settingsAccountIdInput.value = isLoggedIn && demoUser?.id ? String(demoUser.id) : '';
      settingsAccountIdInput.disabled = !isLoggedIn;
    }

    if (settingsDisplayNameInput) {
      settingsDisplayNameInput.value = isLoggedIn ? String(currentUser.nickname || '').trim() : '';
      settingsDisplayNameInput.disabled = !isLoggedIn;
    }

    if (settingsEmailInput) {
      settingsEmailInput.value = prefs.linkedEmail || '';
      settingsEmailInput.disabled = !isLoggedIn;
    }

    [settingsCurrentPassword, settingsNewPassword, settingsNewPasswordConfirm].forEach((inp) => {
      if (inp) inp.disabled = !isLoggedIn;
    });

    if (settingsPriceEmailNotify) {
      settingsPriceEmailNotify.checked = prefs.emailNotifyPrice;
      settingsPriceEmailNotify.disabled = !isLoggedIn;
    }

    updateEmailLinkedUi(prefs);
    refreshNotifyHint(prefs);

    settingsPanelsRoot?.querySelectorAll('button').forEach((btn) => {
      if (btn.classList.contains('auth-password-toggle')) return;
      btn.disabled = !isLoggedIn;
    });
    settingsPanelsRoot?.querySelectorAll('input[type="file"]').forEach((inp) => {
      inp.disabled = !isLoggedIn;
    });

    bindSettingsPasswordToggles();

    settingsAvatarPickBtn?.addEventListener('click', () => {
      if (!isLoggedIn) return;
      settingsAvatarFile?.click();
    });

    settingsAvatarFile?.addEventListener('change', () => {
      const file = settingsAvatarFile.files?.[0];
      if (!file || !file.type.startsWith('image/')) return;
      if (file.size > 1.8 * 1024 * 1024) {
        alert('이미지는 약 1.8MB 이하로 선택해 주세요.');
        settingsAvatarFile.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = String(reader.result || '');
        if (!dataUrl.startsWith('data:image/')) return;
        openAvatarCropModal(dataUrl);
      };
      reader.readAsDataURL(file);
      settingsAvatarFile.value = '';
    });

    settingsAvatarClearBtn?.addEventListener('click', () => {
      if (!isLoggedIn) return;
      localStorage.removeItem(profileAvatarStorageKey);
      applyDefaultAvatar();
      addActivityLog('프로필 이미지를 기본으로 되돌렸어요.');
    });

    settingsSaveDisplayNameBtn?.addEventListener('click', () => {
      if (!isLoggedIn) return;
      const next = String(settingsDisplayNameInput?.value || '').trim();
      if (!next) {
        alert('표시 이름을 입력해 주세요.');
        return;
      }
      if (next.length > 40) {
        alert('표시 이름은 40자 이하로 입력해 주세요.');
        return;
      }
      const user = loadDemoUser();
      if (user) {
        user.nickname = next;
        localStorage.setItem(userStorageKey, JSON.stringify(user));
      }
      persistSessionPatch({ nickname: next });
      currentUser.nickname = next;
      if (nicknameEl) nicknameEl.textContent = next;
      addActivityLog(`표시 이름을 ${next}(으)로 바꿨어요.`);
      alert('표시 이름이 저장되었습니다.');
    });

    settingsSaveIdBtn?.addEventListener('click', () => {
      if (!isLoggedIn) return;
      const nextId = String(settingsAccountIdInput?.value || '').trim();
      if (!nextId) {
        alert('아이디를 입력해 주세요.');
        return;
      }
      const user = loadDemoUser();
      if (!user) {
        alert('저장된 데모 회원 정보가 없어 아이디를 바꿀 수 없어요. 회원가입으로 만든 계정에서 이용해 주세요.');
        return;
      }
      user.id = nextId;
      localStorage.setItem(userStorageKey, JSON.stringify(user));
      persistSessionPatch({ id: nextId });
      currentUser.id = nextId;
      if (profileSubEl) profileSubEl.textContent = `@${nextId.replace(/^@+/, '')}`;
      addActivityLog(`아이디를 ${nextId}(으)로 바꿨어요.`);
      alert('아이디가 저장되었습니다.');
    });

    settingsSavePasswordBtn?.addEventListener('click', () => {
      if (!isLoggedIn) return;
      const cur = String(settingsCurrentPassword?.value || '');
      const next = String(settingsNewPassword?.value || '');
      const next2 = String(settingsNewPasswordConfirm?.value || '');
      const user = loadDemoUser();
      if (!user) {
        alert('저장된 데모 회원 정보가 없어 비밀번호를 바꿀 수 없어요.');
        return;
      }
      if (!cur || user.password !== cur) {
        alert('현재 비밀번호가 올바르지 않습니다.');
        return;
      }
      if (!next || next.length < 4) {
        alert('새 비밀번호는 4자 이상으로 입력해 주세요.');
        return;
      }
      if (next !== next2) {
        alert('새 비밀번호 확인이 일치하지 않습니다.');
        return;
      }
      user.password = next;
      localStorage.setItem(userStorageKey, JSON.stringify(user));
      if (settingsCurrentPassword) settingsCurrentPassword.value = '';
      if (settingsNewPassword) settingsNewPassword.value = '';
      if (settingsNewPasswordConfirm) settingsNewPasswordConfirm.value = '';
      addActivityLog('비밀번호를 변경했어요.');
      alert('비밀번호가 변경되었습니다.');
    });

    settingsSaveEmailBtn?.addEventListener('click', () => {
      if (!isLoggedIn) return;
      const email = String(settingsEmailInput?.value || '').trim();
      if (!validateEmail(email)) {
        alert('올바른 이메일 주소를 입력해 주세요.');
        return;
      }
      const nextPrefs = readAccountPrefs();
      nextPrefs.linkedEmail = email;
      writeAccountPrefs(nextPrefs);
      updateEmailLinkedUi(nextPrefs);
      refreshNotifyHint(nextPrefs);
      addActivityLog(`이메일을 연결했어요 (${email}).`);
      alert('이메일이 저장되었습니다.');
    });

    settingsRemoveEmailBtn?.addEventListener('click', () => {
      if (!isLoggedIn) return;
      const nextPrefs = readAccountPrefs();
      nextPrefs.linkedEmail = '';
      writeAccountPrefs(nextPrefs);
      if (settingsEmailInput) settingsEmailInput.value = '';
      updateEmailLinkedUi(nextPrefs);
      refreshNotifyHint(nextPrefs);
      addActivityLog('이메일 연결을 해제했어요.');
    });

    settingsPriceEmailNotify?.addEventListener('change', () => {
      if (!isLoggedIn) return;
      const nextPrefs = readAccountPrefs();
      nextPrefs.emailNotifyPrice = Boolean(settingsPriceEmailNotify?.checked);
      writeAccountPrefs(nextPrefs);
      refreshNotifyHint(nextPrefs);
      addActivityLog(nextPrefs.emailNotifyPrice ? '이메일 알림을 켰어요.' : '이메일 알림을 껐어요.');
    });

    settingsDeleteAccountBtn?.addEventListener('click', () => {
      if (!isLoggedIn) return;
      if (
        !window.confirm(
          '정말 계정을 삭제할까요? 로컬에 저장된 데모 회원·세션·프로필 사진·설정이 삭제되며 복구할 수 없습니다.',
        )
      ) {
        return;
      }
      localStorage.removeItem(userStorageKey);
      localStorage.removeItem(sessionStorageKey);
      localStorage.removeItem(profileAvatarStorageKey);
      localStorage.removeItem(accountPrefsStorageKey);
      window.location.href = 'auth.html';
    });
  }

  initAvatarCropModal();

  initAccountSettingsUi();

  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem(sessionStorageKey);
    window.location.href = 'index.html';
  });
});
