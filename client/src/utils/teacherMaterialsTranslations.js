export const ensureTeacherMaterialsTranslations = (i18nInstance) => {
  if (!i18nInstance || typeof i18nInstance.addResourceBundle !== "function") {
    return;
  }

  const enResources = {
    teacherMaterials: {
      header: {
        subtitle: "Centralize and share class resources with your students.",
      },
      summary: {
        total: "Total materials",
        topCategory: "Most shared category",
        none: "No uploads yet",
        latest: "Last updated",
        resources: "{{count}} resources",
      },
      dates: {
        notAvailable: "Not available",
      },
      search: {
        placeholder: "Search materials...",
      },
      filters: {
        coursePlaceholder: "Filter by course",
        reset: "Reset filters",
        categoryLabel: "Focus on categories",
        clearCategories: "Clear categories",
      },
      category: {
        lecture: "Lecture",
        assignment: "Assignment",
        reading: "Reading",
        supplementary: "Supplementary",
        other: "Other",
      },
      sort: {
        newest: "Newest first",
        oldest: "Oldest first",
        titleAsc: "Title A–Z",
        titleDesc: "Title Z–A",
      },
      actions: {
        uploadMaterial: "Upload Material",
        preview: "Preview",
        download: "Download",
        delete: "Delete",
        deleteConfirm: "Delete",
        cancel: "Cancel",
        upload: "Upload",
        confirmDelete: "Are you sure you want to delete this material?",
      },
      messages: {
        fetchError: "Failed to fetch materials",
        deleteSuccess: "Material deleted successfully",
        deleteError: "Failed to delete material",
        downloadStarted: "Download started",
        downloadError: "Failed to download material",
      },
      upload: {
        errors: {
          fileMissing: "Please select a file to upload",
          courseMissing: "Please select a course",
          type: "Unsupported file type",
          size: "File must be smaller than {{size}}MB",
        },
        status: {
          uploading: "Uploading material...",
          success: "Material uploaded successfully",
          failure: "Failed to upload material",
        },
      },
      preview: {
        errors: {
          missingId: "Unable to open preview for this file",
          authMissing: "Authentication token not found",
          loadFailure: "Failed to load file for preview",
        },
        unavailable: "Unable to preview this file",
        course: "Course",
        updated: "Last updated",
        fileName: "File name",
        fileSize: "File size",
      },
      fileSize: {
        unknown: "Unknown",
      },
      table: {
        material: "Material",
        noDescription: "No description",
        unknownCourse: "Unknown course",
        updatedLabel: "Updated",
        size: "Size",
        actions: "Actions",
      },
      recentPreview: {
        title: "Recently previewed",
        clear: "Clear list",
      },
      emptyState: {
        description: "No materials match your filters yet.",
        hint: "Try adjusting filters or upload a new resource.",
      },
      modal: {
        uploadTitle: "Upload Material",
        previewTitle: "Material Preview",
      },
      form: {
        course: "Course",
        coursePlaceholder: "Select course",
        title: "Title",
        titleRequired: "Please enter title",
        titlePlaceholder: "Enter material title",
        description: "Description",
        descriptionPlaceholder: "Add helpful notes or instructions for students",
        category: "Category",
        categoryRequired: "Please choose a category",
        file: "File",
        uploadPrompt: "Click or drag file to this area to upload",
        uploadHint: "Videos, documents, spreadsheets, and zipped resources up to 200MB.",
      },
      courses: {
        untitled: "Untitled course",
      },
    },
  };

  const jaResources = {
    teacherMaterials: {
      header: {
        subtitle: "教材を一元管理し、生徒と共有しましょう。",
      },
      summary: {
        total: "教材総数",
        topCategory: "最も共有されているカテゴリ",
        none: "まだアップロードがありません",
        latest: "最終更新",
        resources: "教材 {{count}} 件",
      },
      dates: {
        notAvailable: "利用不可",
      },
      search: {
        placeholder: "教材を検索...",
      },
      filters: {
        coursePlaceholder: "コースで絞り込む",
        reset: "フィルターをリセット",
        categoryLabel: "カテゴリで絞り込む",
        clearCategories: "カテゴリをクリア",
      },
      category: {
        lecture: "講義",
        assignment: "課題",
        reading: "読書教材",
        supplementary: "補助教材",
        other: "その他",
      },
      sort: {
        newest: "新しい順",
        oldest: "古い順",
        titleAsc: "タイトル A–Z",
        titleDesc: "タイトル Z–A",
      },
      actions: {
        uploadMaterial: "教材をアップロード",
        preview: "プレビュー",
        download: "ダウンロード",
        delete: "削除",
        deleteConfirm: "削除",
        cancel: "キャンセル",
        upload: "アップロード",
        confirmDelete: "この教材を削除してもよろしいですか？",
      },
      messages: {
        fetchError: "教材の取得に失敗しました",
        deleteSuccess: "教材を削除しました",
        deleteError: "教材の削除に失敗しました",
        downloadStarted: "ダウンロードを開始しました",
        downloadError: "教材のダウンロードに失敗しました",
      },
      upload: {
        errors: {
          fileMissing: "アップロードするファイルを選択してください",
          courseMissing: "コースを選択してください",
          type: "サポートされていないファイル形式です",
          size: "ファイルサイズは{{size}}MB以下にしてください",
        },
        status: {
          uploading: "教材をアップロードしています...",
          success: "教材をアップロードしました",
          failure: "教材のアップロードに失敗しました",
        },
      },
      preview: {
        errors: {
          missingId: "このファイルのプレビューを開けません",
          authMissing: "認証トークンが見つかりません",
          loadFailure: "プレビュー用ファイルの読み込みに失敗しました",
        },
        unavailable: "このファイルはプレビューできません",
        course: "コース",
        updated: "最終更新",
        fileName: "ファイル名",
        fileSize: "ファイルサイズ",
      },
      fileSize: {
        unknown: "不明",
      },
      table: {
        material: "教材",
        noDescription: "説明はありません",
        unknownCourse: "不明なコース",
        updatedLabel: "更新日時",
        size: "サイズ",
        actions: "操作",
      },
      recentPreview: {
        title: "最近プレビューした教材",
        clear: "リストをクリア",
      },
      emptyState: {
        description: "条件に一致する教材はまだありません。",
        hint: "フィルターを調整するか、新しい教材をアップロードしてください。",
      },
      modal: {
        uploadTitle: "教材をアップロード",
        previewTitle: "教材プレビュー",
      },
      form: {
        course: "コース",
        coursePlaceholder: "コースを選択",
        title: "タイトル",
        titleRequired: "タイトルを入力してください",
        titlePlaceholder: "教材のタイトルを入力",
        description: "説明",
        descriptionPlaceholder: "生徒へのメモや指示を追加",
        category: "カテゴリ",
        categoryRequired: "カテゴリを選択してください",
        file: "ファイル",
        uploadPrompt: "ここをクリックするか、ファイルをドラッグしてアップロード",
        uploadHint: "動画・ドキュメント・スプレッドシート・ZIP（最大200MB）に対応しています。",
      },
      courses: {
        untitled: "名称未設定のコース",
      },
    },
  };

  i18nInstance.addResourceBundle("en", "translation", enResources, true, true);
  i18nInstance.addResourceBundle("ja", "translation", jaResources, true, true);
};

