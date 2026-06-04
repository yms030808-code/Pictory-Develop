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
  const recommendHistoryStatEl = document.getElementById('mypageRecommendStat');
  const recommendSummaryEmptyEl = document.getElementById('mypageRecommendSummaryEmpty');
  const recommendSummaryListEl = document.getElementById('mypageRecommendSummaryList');
  const recommendEmptyEl = document.getElementById('mypageRecommendEmpty');
  const recommendHistoryEl = document.getElementById('mypageRecommendHistory');
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
  const archiveDropZone = document.getElementById('mypageArchiveDropZone');
  const archiveFileInput = document.getElementById('mypageArchiveFileInput');
  const archivePreviews = document.getElementById('mypageArchivePreviews');
  const archivePreviewGrid = document.getElementById('mypageArchivePreviewGrid');
  const archivePreviewCount = document.getElementById('mypageArchivePreviewCount');
  const archiveModelInput = document.getElementById('mypageArchiveModelInput');
  const archiveCategorySelect = document.getElementById('mypageArchiveCategorySelect');
  const archiveCategoryRoot = document.getElementById('mypageArchiveCategoryRoot');
  const archiveCategoryTrigger = document.getElementById('mypageArchiveCategoryTrigger');
  const archiveCategoryList = document.getElementById('mypageArchiveCategoryList');
  const archiveCategoryValue = document.getElementById('mypageArchiveCategoryValue');
  let archiveCategoryDropdown = null;
  let archiveEditCategoryDropdown = null;
  const archiveShareCommunity = document.getElementById('mypageArchiveShareCommunity');
  const archiveUploadBtn = document.getElementById('mypageArchiveUploadBtn');
  const communityPanel = document.querySelector('[data-mypage-panel="community"]');
  const communityEmptyState = communityPanel?.querySelector('.mypage-empty-state');
  const communityActivityEl = document.getElementById('mypageCommunityActivity');
  const likedPostsListEl = document.getElementById('mypageLikedPostsList');
  const commentsListEl = document.getElementById('mypageCommentsList');
  const categoryLabelToKey = {
    인물: 'portrait',
    풍경: 'landscape',
    일상: 'daily',
    야경: 'night',
    음식: 'food',
  };
  const ARCHIVE_DEFAULT_CATEGORIES = ['일상', '인물', '풍경', '야경', '음식'];
  const archiveCustomCategoriesKey = 'picoryArchiveCustomCategories';
  const ARCHIVE_CATEGORY_MAX_LEN = 16;
  const ARCHIVE_CUSTOM_CATEGORY_MAX = 20;

  const escapeCategoryAttr = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;');

  const escapeCategoryHtml = (value) => escapeCategoryAttr(value);

  function readArchiveCustomCategories() {
    try {
      const raw = localStorage.getItem(archiveCustomCategoriesKey);
      const list = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) return [];
      return list
        .map((item) => String(item || '').trim())
        .filter((item) => item && !ARCHIVE_DEFAULT_CATEGORIES.includes(item));
    } catch (_) {
      return [];
    }
  }

  function writeArchiveCustomCategories(list) {
    try {
      localStorage.setItem(archiveCustomCategoriesKey, JSON.stringify(list.slice(0, ARCHIVE_CUSTOM_CATEGORY_MAX)));
    } catch (_) {
      /* noop */
    }
  }

  function normalizeArchiveCategoryLabel(raw) {
    return String(raw || '')
      .trim()
      .replace(/\s+/g, ' ');
  }

  function syncArchiveCustomCategoriesFromPosts() {
    const seen = new Set(readArchiveCustomCategories());
    let changed = false;
    readArchiveList().forEach((item) => {
      const label = normalizeArchiveCategoryLabel(item?.categoryLabel);
      if (!label || ARCHIVE_DEFAULT_CATEGORIES.includes(label) || seen.has(label)) return;
      seen.add(label);
      changed = true;
    });
    if (changed) writeArchiveCustomCategories([...seen]);
  }

  function getAllArchiveCategoryLabels() {
    const merged = [...ARCHIVE_DEFAULT_CATEGORIES];
    const seen = new Set(merged);
    readArchiveCustomCategories().forEach((label) => {
      if (!label || seen.has(label)) return;
      seen.add(label);
      merged.push(label);
    });
    return merged;
  }

  function labelToCommunityKey(label) {
    return categoryLabelToKey[label] || 'custom';
  }

  function isArchiveCategoryLabelValid(label) {
    return getAllArchiveCategoryLabels().includes(label);
  }

  function populateArchiveCategoryMenu(listEl, { showAddRow = false } = {}) {
    if (!listEl) return;
    const labels = getAllArchiveCategoryLabels();
    const optionsHtml = labels
      .map(
        (value) =>
          `<li class="picory-dropdown__item" role="option" data-value="${escapeCategoryAttr(value)}" tabindex="-1">${escapeCategoryHtml(value)}</li>`,
      )
      .join('');
    const addRowHtml = showAddRow
      ? `<li class="picory-dropdown__add" role="presentation">
          <div class="mypage-archive-category__add">
            <input type="text" class="mypage-archive-category__add-input form-input" placeholder="새 주제" maxlength="${ARCHIVE_CATEGORY_MAX_LEN}" aria-label="새 주제 이름">
            <button type="button" class="mypage-archive-category__add-btn btn btn--outline btn--xs">추가</button>
          </div>
        </li>`
      : '';
    listEl.innerHTML = optionsHtml + addRowHtml;
  }

  function refreshArchiveCategoryMenus(selectedValue) {
    const current =
      selectedValue ||
      archiveCategoryDropdown?.getValue() ||
      archiveCategorySelect?.value ||
      '일상';
    populateArchiveCategoryMenu(archiveCategoryList, { showAddRow: true });
    archiveCategoryDropdown?.setValue(current);

    const editList = archiveEditOverlay?.querySelector('#archiveEditCategoryList');
    if (editList) {
      const editCurrent = archiveEditCategoryDropdown?.getValue() || current;
      populateArchiveCategoryMenu(editList, { showAddRow: true });
      archiveEditCategoryDropdown?.setValue(editCurrent);
    }
  }

  function tryAddArchiveCategory(rawLabel, sourceListEl) {
    const name = normalizeArchiveCategoryLabel(rawLabel);
    if (!name) {
      alert('주제 이름을 입력해 주세요.');
      return false;
    }
    if (name.length > ARCHIVE_CATEGORY_MAX_LEN) {
      alert(`주제는 ${ARCHIVE_CATEGORY_MAX_LEN}자 이내로 입력해 주세요.`);
      return false;
    }
    const activeDropdown =
      sourceListEl?.id === 'archiveEditCategoryList'
        ? archiveEditCategoryDropdown
        : archiveCategoryDropdown;
    if (getAllArchiveCategoryLabels().includes(name)) {
      activeDropdown?.setValue(name);
      activeDropdown?.close();
      return true;
    }
    const custom = readArchiveCustomCategories();
    if (custom.length >= ARCHIVE_CUSTOM_CATEGORY_MAX) {
      alert(`사용자 주제는 최대 ${ARCHIVE_CUSTOM_CATEGORY_MAX}개까지 추가할 수 있어요.`);
      return false;
    }
    custom.push(name);
    writeArchiveCustomCategories(custom);
    refreshArchiveCategoryMenus(name);
    activeDropdown?.setValue(name);
    activeDropdown?.close();
    return true;
  }

  function bindArchiveCategoryAddRow(listEl) {
    if (!listEl || listEl.dataset.categoryAddBound === '1') return;
    listEl.dataset.categoryAddBound = '1';
    listEl.addEventListener('click', (e) => {
      const addRow = e.target.closest('.picory-dropdown__add');
      if (!addRow || !listEl.contains(addRow)) return;
      e.stopPropagation();
      if (!e.target.closest('.mypage-archive-category__add-btn')) return;
      const input = addRow.querySelector('.mypage-archive-category__add-input');
      tryAddArchiveCategory(input?.value || '', listEl);
      if (input) input.value = '';
    });
    listEl.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const input = e.target.closest('.mypage-archive-category__add-input');
      if (!input || !listEl.contains(input)) return;
      e.preventDefault();
      e.stopPropagation();
      tryAddArchiveCategory(input.value, listEl);
      input.value = '';
    });
    listEl.addEventListener('mousedown', (e) => {
      if (e.target.closest('.picory-dropdown__add')) e.stopPropagation();
    });
  }

  function initArchiveCategoryDropdowns() {
    syncArchiveCustomCategoriesFromPosts();
    populateArchiveCategoryMenu(archiveCategoryList, { showAddRow: true });
    bindArchiveCategoryAddRow(archiveCategoryList);

    if (typeof window.mountPicoryDropdown === 'function' && archiveCategoryTrigger && archiveCategoryList) {
      archiveCategoryDropdown = window.mountPicoryDropdown({
        root: archiveCategoryRoot,
        trigger: archiveCategoryTrigger,
        list: archiveCategoryList,
        valueEl: archiveCategoryValue,
        hiddenInput: archiveCategorySelect,
        initialValue: archiveCategorySelect?.value || '일상',
        isValid: isArchiveCategoryLabelValid,
      });
    }
  }

  initArchiveCategoryDropdowns();

  const ARCHIVE_UPLOAD_MAX_PHOTOS = 12;
  /** @type {{ id: string, name: string, size: number, dataUrl: string }[]} */
  let selectedArchiveItems = [];
  let archiveUploadBusy = false;
  let archiveUploadItemSeq = 0;
  const archiveUploadDefaultLabel = archiveUploadBtn?.textContent?.trim() || '사진 올리기';
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
      if (tab.dataset.mypageTab === 'recommend' || tab.dataset.mypageTab === 'home') {
        renderRecommendHistory();
      }
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

  const formatArchiveDateTime = (isoString) => {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
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

  const readRecommendHistory = () => {
    if (window.PicoryRecommendHistory?.read) {
      return window.PicoryRecommendHistory.read();
    }
    return readJsonList('picoryRecommendHistory');
  };

  const renderRecommendHistory = () => {
    const items = readRecommendHistory().slice().reverse();
    const countLabel = items.length ? `${items.length}건` : '아직 없음';

    if (recommendHistoryStatEl) {
      recommendHistoryStatEl.textContent = countLabel;
    }

    const hasItems = items.length > 0;
    recommendSummaryEmptyEl?.classList.toggle('hidden', hasItems);
    recommendEmptyEl?.classList.toggle('hidden', hasItems);

    if (recommendSummaryListEl) {
      recommendSummaryListEl.hidden = !hasItems;
      if (!hasItems) {
        recommendSummaryListEl.innerHTML = '';
      } else {
        recommendSummaryListEl.innerHTML = items
          .slice(0, 3)
          .map((entry) => {
            const top = entry.items?.[0];
            const when = formatTime(entry.createdAt);
            const label = top?.name || 'AI 추천 결과';
            const detail = entry.summary || top?.why || '업로드 사진 기반 추천';
            const dateMeta = `${when}${entry.moodTags?.length ? ` · ${escapeHtml(entry.moodTags.slice(0, 2).join(', '))}` : ''}`;
            return `
              <article class="mypage-recommend-summary-item">
                <div class="mypage-recommend-summary-item__head">
                  <strong>${escapeHtml(label)}</strong>
                  <span class="mypage-recommend-summary-item__date mypage-muted">${dateMeta}</span>
                </div>
                <p>${escapeHtml(detail)}</p>
              </article>
            `;
          })
          .join('');
      }
    }

    if (!recommendHistoryEl) return;
    if (!hasItems) {
      recommendHistoryEl.hidden = true;
      recommendHistoryEl.innerHTML = '';
      return;
    }

    recommendHistoryEl.hidden = false;
    recommendHistoryEl.innerHTML = items
      .map((entry) => {
        const when = formatTime(entry.createdAt);
        const tags = (entry.moodTags || [])
          .map((t) => `<span class="tag tag--natural">${escapeHtml(t)}</span>`)
          .join('');
        const cameras = (entry.items || [])
          .map((cam, i) => {
            const badge = i === 0 ? 'Best Match' : '대안';
            const scoreLine =
              cam.score != null && Number.isFinite(Number(cam.score))
                ? `색감 유사도 약 ${Number(cam.score).toFixed(1)}점`
                : '';
            const whyLine = [scoreLine, cam.why].filter(Boolean).join(' · ');
            return `
              <article class="mypage-recommend-camera card">
                <span class="mypage-recommend-camera__badge">${escapeHtml(badge)}</span>
                <img class="mypage-recommend-camera__img" src="${escapeHtml(cam.thumbnail || '/images/cameras/default-camera.png')}" alt="${escapeHtml(cam.name)}" loading="lazy">
                <div class="mypage-recommend-camera__body">
                  <h4>${escapeHtml(cam.name)}</h4>
                  ${cam.lens ? `<p class="mypage-recommend-camera__lens">+ ${escapeHtml(cam.lens)}</p>` : ''}
                  ${whyLine ? `<p class="mypage-recommend-camera__why">${escapeHtml(whyLine)}</p>` : ''}
                  <div class="mypage-recommend-camera__meta">
                    ${cam.price ? `<span>${escapeHtml(cam.price)}</span>` : ''}
                    <a class="btn btn--outline btn--xs" href="${escapeHtml(cam.href || `price.html?q=${encodeURIComponent(cam.name)}`)}">시세 보기</a>
                  </div>
                </div>
              </article>
            `;
          })
          .join('');

        return `
          <article class="mypage-recommend-entry card">
            <header class="mypage-recommend-entry__head">
              <div>
                <p class="mypage-recommend-entry__type">AI 사진 추천</p>
                <time class="mypage-muted">${escapeHtml(when)}</time>
              </div>
              <button type="button" class="mypage-recommend-entry__remove" data-recommend-remove="${escapeHtml(entry.id)}" aria-label="추천 기록 삭제">×</button>
            </header>
            <div class="mypage-recommend-entry__layout">
              ${entry.imageThumb ? `<img class="mypage-recommend-entry__photo" src="${entry.imageThumb}" alt="업로드한 참고 사진" loading="lazy">` : ''}
              <div class="mypage-recommend-entry__detail">
                ${entry.summary ? `<p class="mypage-recommend-entry__summary">${escapeHtml(entry.summary)}</p>` : ''}
                ${tags ? `<div class="mypage-recommend-entry__tags">${tags}</div>` : ''}
                <div class="mypage-recommend-entry__cameras">${cameras}</div>
              </div>
            </div>
          </article>
        `;
      })
      .join('');
  };

  recommendHistoryEl?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const removeBtn = target.closest('[data-recommend-remove]');
    if (!removeBtn) return;
    const id = removeBtn.getAttribute('data-recommend-remove');
    if (!id) return;
    const next = readRecommendHistory().filter((entry) => entry.id !== id);
    try {
      localStorage.setItem('picoryRecommendHistory', JSON.stringify(next));
    } catch (_) {
      /* noop */
    }
    renderRecommendHistory();
  });

  window.addEventListener('picory-recommend-history-updated', renderRecommendHistory);
  window.addEventListener('storage', (event) => {
    if (event.key === 'picoryRecommendHistory') renderRecommendHistory();
  });
  window.addEventListener('pageshow', renderRecommendHistory);

  renderRecommendHistory();

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
      : `
        <div class="mypage-community-empty mypage-community-empty--comments">
          <p class="mypage-community-empty__title">아직 남긴 댓글이 없어요</p>
          <p class="mypage-muted">지금 첫 댓글을 달고 다른 사람들의 사진과 촬영 이야기에 함께해 보세요.</p>
          <div class="mypage-community-empty__actions">
            <button type="button" class="btn btn--primary btn--sm" data-mypage-goto-community-tab>댓글 남기러 가기</button>
          </div>
        </div>
      `;
  };

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (!target.closest('[data-mypage-goto-community-tab]')) return;
    event.preventDefault();
    activateTab('community');
    const hash = 'community';
    const base = `${window.location.pathname}${window.location.search}`;
    try {
      history.replaceState(null, '', `${base}#${hash}`);
    } catch (_) {
      window.location.hash = hash;
    }
    window.location.href = 'community.html';
  });

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

  let archiveViewOverlay = null;

  function ensureArchiveViewModal() {
    if (archiveViewOverlay) return archiveViewOverlay;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay hidden';
    overlay.id = 'mypageArchiveViewModal';
    overlay.innerHTML = `
      <div class="modal modal--archive-view" role="dialog" aria-modal="true" aria-labelledby="mypageArchiveViewTitle">
        <div class="modal__header">
          <h3 id="mypageArchiveViewTitle">사진 보기</h3>
          <button class="modal__close" type="button" data-archive-view-close aria-label="닫기">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal__body mypage-archive-view__body">
          <div class="mypage-archive-view__img-wrap">
            <img class="mypage-archive-view__img" id="mypageArchiveViewImg" alt="">
          </div>
          <div class="mypage-archive-view__meta">
            <p class="mypage-archive-view__camera" id="mypageArchiveViewCamera"></p>
            <p class="mypage-archive-view__detail" id="mypageArchiveViewDetail"></p>
            <time class="mypage-archive-view__time" id="mypageArchiveViewTime"></time>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const close = () => overlay.classList.add('hidden');
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
    overlay.querySelector('[data-archive-view-close]')?.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !overlay.classList.contains('hidden')) close();
    });

    archiveViewOverlay = overlay;
    return overlay;
  }

  function openArchiveView({ imageSrc, cameraModel, categoryLabel, createdAt }) {
    const overlay = ensureArchiveViewModal();
    const img = overlay.querySelector('#mypageArchiveViewImg');
    const cameraEl = overlay.querySelector('#mypageArchiveViewCamera');
    const detailEl = overlay.querySelector('#mypageArchiveViewDetail');
    const timeEl = overlay.querySelector('#mypageArchiveViewTime');
    const model = String(cameraModel || '업로드 이미지').trim() || '업로드 이미지';
    const category = String(categoryLabel || '').trim();
    const when = formatArchiveDateTime(createdAt);

    if (img) {
      img.src = imageSrc || '';
      img.alt = model;
    }
    if (cameraEl) cameraEl.textContent = model;
    if (detailEl) detailEl.textContent = category || '주제 미지정';
    if (timeEl) {
      if (when) {
        timeEl.dateTime = createdAt || '';
        timeEl.textContent = `업로드 ${when}`;
      } else {
        timeEl.removeAttribute('datetime');
        timeEl.textContent = '업로드 시각 정보 없음';
      }
    }
    overlay.classList.remove('hidden');
  }

  const renderArchive = async () => {
    if (!archiveGridEl) return;
    let items = readArchiveList();
    const store = window.PicoryCommunityImageStore;

    if (store && items.length) {
      items = await store.migratePosts(items);
      items = items.map((item) => {
        if (!item?.imageKey || !item.imageDataUrl) return item;
        const { imageDataUrl, ...rest } = item;
        return rest;
      });
      writeArchiveList(items);
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

    const cards = await Promise.all(
      items
        .slice()
        .reverse()
        .map(async (item) => {
          const model = escapeHtml(item.cameraModel || '업로드 이미지');
          const category = escapeHtml(item.categoryLabel || '');
          const imageSrc = store
            ? await store.resolvePostImageSrc(item)
            : String(item.imageDataUrl || item.imageThumb || '');
          const when = formatArchiveDateTime(item.createdAt);
          const whenLabel = when ? escapeHtml(when) : '';
          const whenAttr = item.createdAt ? escapeHtml(item.createdAt) : '';
          return `
          <article class="mypage-archive-card card" data-archive-id="${escapeHtml(item.id || '')}">
            <button
              type="button"
              class="mypage-archive-card__thumb"
              aria-label="${model} 크게 보기"
            >
              <img src="${escapeHtml(imageSrc)}" alt="" loading="lazy" decoding="async">
            </button>
            <div class="mypage-archive-card__body">
              <p class="mypage-archive-card__title"><strong>${model}</strong>${category ? `<span class="mypage-archive-card__category"> · ${category}</span>` : ''}</p>
              ${whenLabel ? `<time class="mypage-archive-card__time" datetime="${whenAttr}">${whenLabel}</time>` : '<span class="mypage-archive-card__time mypage-archive-card__time--unknown">업로드 시각 정보 없음</span>'}
            </div>
          </article>
        `;
        }),
    );
    archiveGridEl.innerHTML = cards.join('');
  };

  archiveGridEl?.addEventListener('click', async (e) => {
    const thumb = e.target.closest('.mypage-archive-card__thumb');
    if (!thumb || !archiveGridEl.contains(thumb)) return;
    const card = thumb.closest('[data-archive-id]');
    const id = card?.getAttribute('data-archive-id');
    if (!id) return;
    const item = readArchiveList().find((entry) => entry && entry.id === id);
    if (!item) return;
    const store = window.PicoryCommunityImageStore;
    const imageSrc = store
      ? await store.resolvePostImageSrc(item)
      : String(item.imageDataUrl || item.imageThumb || '');
    openArchiveView({
      imageSrc,
      cameraModel: item.cameraModel,
      categoryLabel: item.categoryLabel,
      createdAt: item.createdAt,
    });
  });
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
            <div class="picory-dropdown mypage-archive-category" id="archiveEditCategoryRoot">
              <input type="hidden" id="archiveEditCategorySelect" value="일상">
              <button
                type="button"
                class="picory-dropdown__trigger"
                id="archiveEditCategoryTrigger"
                aria-expanded="false"
                aria-haspopup="listbox"
                aria-labelledby="archiveEditCategoryValue"
              >
                <span id="archiveEditCategoryValue" class="picory-dropdown__value">일상</span>
                <span class="picory-dropdown__chevron" aria-hidden="true">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0L5 6L10 0" fill="currentColor"/></svg>
                </span>
              </button>
              <ul class="picory-dropdown__menu" id="archiveEditCategoryList" role="listbox" hidden></ul>
            </div>
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
    overlay.querySelector('[data-archive-edit-save]')?.addEventListener('click', async () => {
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
      const imageKey = String(prev.imageKey || prev.id || archiveEditingId);
      const nextImage = archiveEditImageDataUrl || prev.imageDataUrl;
      const store = window.PicoryCommunityImageStore;
      if (store && nextImage && archiveEditImageDataUrl) {
        try {
          await store.put(imageKey, nextImage);
        } catch (_) {
          /* keep legacy inline if IDB fails */
        }
      }
      const next = {
        ...prev,
        cameraModel,
        categoryLabel,
        imageKey,
        updatedAt: new Date().toISOString(),
      };
      if (!store && nextImage) next.imageDataUrl = nextImage;
      else if (next.imageDataUrl) delete next.imageDataUrl;
      archiveList[idx] = next;
      writeArchiveList(archiveList);

      // 커뮤니티에도 공유된 항목이면 같이 갱신(id 기준)
      const communityList = readCommunityList();
      const cIdx = communityList.findIndex((x) => x && x.id === archiveEditingId);
      if (cIdx >= 0) {
        const categoryKey = labelToCommunityKey(categoryLabel);
        communityList[cIdx] = {
          ...communityList[cIdx],
          cameraModel,
          categoryLabel,
          imageKey,
          communityTags: `${categoryKey} daily`,
        };
        if (communityList[cIdx].imageDataUrl) delete communityList[cIdx].imageDataUrl;
        writeCommunityList(communityList);
      }

      addActivityLog(`${cameraModel} 아카이브 항목을 수정했어요.`);
      close();
      renderArchive();
      alert('수정 내용을 저장했어요.');
    });

    if (typeof window.mountPicoryDropdown === 'function') {
      const editRoot = overlay.querySelector('#archiveEditCategoryRoot');
      const editTrigger = overlay.querySelector('#archiveEditCategoryTrigger');
      const editList = overlay.querySelector('#archiveEditCategoryList');
      const editValue = overlay.querySelector('#archiveEditCategoryValue');
      const editHidden = overlay.querySelector('#archiveEditCategorySelect');
      if (editTrigger && editList) {
        populateArchiveCategoryMenu(editList, { showAddRow: true });
        bindArchiveCategoryAddRow(editList);
        archiveEditCategoryDropdown = window.mountPicoryDropdown({
          root: editRoot,
          trigger: editTrigger,
          list: editList,
          valueEl: editValue,
          hiddenInput: editHidden,
          initialValue: '일상',
          isValid: isArchiveCategoryLabelValid,
        });
      }
    }

    archiveEditOverlay = overlay;
    return overlay;
  }

  renderArchive();

  function nextArchiveItemId() {
    archiveUploadItemSeq += 1;
    return `pick-${Date.now()}-${archiveUploadItemSeq}`;
  }

  function setArchiveUploadBusy(busy, label) {
    archiveUploadBusy = busy;
    if (!archiveUploadBtn) return;
    archiveUploadBtn.disabled = busy;
    archiveUploadBtn.textContent = busy && label ? label : archiveUploadDefaultLabel;
  }

  function updateArchivePreviewState() {
    const n = selectedArchiveItems.length;
    if (archivePreviews) archivePreviews.hidden = n === 0;
    if (archivePreviewCount) {
      archivePreviewCount.textContent =
        n > 0 ? `${n}장 선택됨 (최대 ${ARCHIVE_UPLOAD_MAX_PHOTOS}장)` : '0장 선택됨';
    }
  }

  function appendArchivePreviewItem(item) {
    if (!archivePreviewGrid) return;
    const div = document.createElement('div');
    div.className = 'upload-preview-item';
    div.dataset.archiveItemId = item.id;
    div.innerHTML = `<img src="${item.dataUrl}" alt="${escapeHtml(item.name)}">
      <button type="button" class="upload-preview-item__remove" aria-label="제거">×</button>`;
    div.querySelector('button')?.addEventListener('click', () => {
      selectedArchiveItems = selectedArchiveItems.filter((x) => x.id !== item.id);
      div.remove();
      updateArchivePreviewState();
    });
    archivePreviewGrid.appendChild(div);
    updateArchivePreviewState();
  }

  async function addArchiveFiles(fileList) {
    const incoming = [...fileList].filter((file) => file && file.size > 0);
    if (!incoming.length) return;

    const slotsLeft = ARCHIVE_UPLOAD_MAX_PHOTOS - selectedArchiveItems.length;
    if (slotsLeft <= 0) {
      alert(`한 번에 최대 ${ARCHIVE_UPLOAD_MAX_PHOTOS}장까지 올릴 수 있어요.`);
      return;
    }

    const batch = incoming.slice(0, slotsLeft);
    if (incoming.length > batch.length) {
      alert(`최대 ${ARCHIVE_UPLOAD_MAX_PHOTOS}장까지만 선택됩니다. 나머지는 제외했어요.`);
    }

    const prepare = window.PicoryCommunityImageStore?.prepareFromFile;
    if (!prepare) {
      alert('이미지 처리 모듈을 불러오지 못했습니다. 페이지를 새로고침해 주세요.');
      return;
    }

    setArchiveUploadBusy(true, '사진 처리 중…');
    try {
      for (const file of batch) {
        if (file.type && !file.type.startsWith('image/')) {
          alert(`"${file.name}"은(는) 이미지 파일이 아닙니다.`);
          continue;
        }
        try {
          const dataUrl = await prepare(file);
          const entry = {
            id: nextArchiveItemId(),
            name: file.name,
            size: file.size,
            dataUrl,
          };
          selectedArchiveItems.push(entry);
          appendArchivePreviewItem(entry);
        } catch (_) {
          alert(`"${file.name}" 파일을 처리하지 못했습니다. JPG/PNG로 다시 시도해 주세요.`);
        }
      }
    } finally {
      setArchiveUploadBusy(false);
    }
  }

  function resetArchiveUploadForm() {
    selectedArchiveItems = [];
    if (archivePreviewGrid) archivePreviewGrid.innerHTML = '';
    if (archivePreviews) archivePreviews.hidden = true;
    if (archivePreviewCount) archivePreviewCount.textContent = '0장 선택됨';
    if (archiveDropZone) archiveDropZone.classList.remove('is-over');
    if (archiveFileInput) archiveFileInput.value = '';
    if (archiveModelInput) archiveModelInput.value = '';
    archiveCategoryDropdown?.setValue('일상');
    if (archiveShareCommunity) archiveShareCommunity.checked = false;
  }

  archiveDropZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    archiveDropZone.classList.add('is-over');
  });
  archiveDropZone?.addEventListener('dragleave', () => {
    archiveDropZone.classList.remove('is-over');
  });
  archiveDropZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    archiveDropZone.classList.remove('is-over');
    addArchiveFiles(e.dataTransfer?.files || []);
  });
  archiveFileInput?.addEventListener('change', () => {
    addArchiveFiles(archiveFileInput.files || []);
    archiveFileInput.value = '';
  });

  archiveUploadBtn?.addEventListener('click', async () => {
    if (archiveUploadBusy) return;

    if (!selectedArchiveItems.length) {
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
    const categoryKey = labelToCommunityKey(categoryLabel);
    let authorHandle = '@게스트';
    try {
      const raw = localStorage.getItem(sessionStorageKey);
      const session = raw ? JSON.parse(raw) : null;
      if (session?.nickname) authorHandle = `@${String(session.nickname).trim() || '게스트'}`;
    } catch (_) {
      /* noop */
    }

    const shouldShareToCommunity = Boolean(archiveShareCommunity?.checked);
    const store = window.PicoryCommunityImageStore;
    const batchId = Date.now();
    const createdAt = new Date().toISOString();
    const count = selectedArchiveItems.length;

    setArchiveUploadBusy(true, `업로드 중… (${count}장)`);

    const archiveItems = [];
    const communityItems = [];

    try {
      for (let index = 0; index < selectedArchiveItems.length; index += 1) {
        const item = selectedArchiveItems[index];
        const archiveId = `archive-${batchId}-${index}`;

        if (store) {
          try {
            await store.put(archiveId, item.dataUrl);
          } catch (_) {
            throw new Error('IDB_PUT');
          }
        }

        const archiveItem = {
          id: archiveId,
          imageKey: archiveId,
          cameraModel,
          categoryLabel,
          sharedToCommunity: shouldShareToCommunity,
          aperture: '-',
          shutterSpeed: '-',
          iso: '-',
          focalLength: '-',
          authorHandle,
          createdAt,
        };
        if (!store) archiveItem.imageDataUrl = item.dataUrl;
        archiveItems.push(archiveItem);

        if (shouldShareToCommunity) {
          communityItems.push({
            ...archiveItem,
            communityTags: `${categoryKey} daily`,
            likes: Math.floor(Math.random() * 60) + 1,
          });
        }
      }

      const archiveList = readArchiveList();
      archiveList.push(...archiveItems);
      writeArchiveList(archiveList);

      if (communityItems.length) {
        const communityList = readCommunityList();
        communityList.push(...communityItems);
        writeCommunityList(communityList);
      }
    } catch (_) {
      alert('사진 저장에 실패했습니다. 브라우저 저장 공간을 확인한 뒤 다시 시도해 주세요.');
      setArchiveUploadBusy(false);
      return;
    }

    renderArchive();
    addActivityLog(
      shouldShareToCommunity
        ? `${cameraModel} 사진 ${count}장을 아카이브에 저장하고 커뮤니티에도 올렸어요.`
        : `${cameraModel} 사진 ${count}장을 아카이브에 저장했어요.`,
    );

    resetArchiveUploadForm();
    setArchiveUploadBusy(false);
    alert(
      shouldShareToCommunity
        ? `아카이브에 ${count}장 저장하고 커뮤니티에도 업로드했어요.`
        : `아카이브에 ${count}장 저장했어요.`,
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

  function syncPasswordToggleIcon(toggleButton, isRevealed) {
    toggleButton.classList.toggle('is-revealed', isRevealed);
    toggleButton.setAttribute('aria-label', isRevealed ? '비밀번호 숨기기' : '비밀번호 보기');
    toggleButton.setAttribute('aria-pressed', isRevealed ? 'true' : 'false');
  }

  function bindSettingsPasswordToggles() {
    settingsSectionRoot?.querySelectorAll('[data-password-toggle]').forEach((toggleButton) => {
      if (toggleButton.dataset.passwordToggleBound === '1') return;
      const input = toggleButton.parentElement?.querySelector('input');
      if (!(input instanceof HTMLInputElement)) return;
      toggleButton.dataset.passwordToggleBound = '1';
      syncPasswordToggleIcon(toggleButton, input.type === 'text');
      toggleButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const reveal = input.type === 'password';
        input.type = reveal ? 'text' : 'password';
        syncPasswordToggleIcon(toggleButton, reveal);
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
