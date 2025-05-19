export const editorConfig = {
    plugins: [
        'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image',
        'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks',
        'wordcount'
    ],
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat | visualblocks searchreplace codesample',
    menubar: false,
    // Add these properties to ensure proper rendering
    height: 400,
    resize: true,
    toolbar_mode: 'sliding', // This helps with responsive toolbar
    branding: false,
    statusbar: true,
    // Ensure plugins are properly loaded
    setup: function (editor: any) {
        editor.on('init', function () {
            // Force a refresh of the editor after initialization
            setTimeout(function () {
                editor.execCommand('mceRepaint');
            }, 300);
        });
    }
};