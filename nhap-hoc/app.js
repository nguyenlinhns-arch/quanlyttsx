(() => {
  const el = document.getElementById('updatedText');
  if (el) {
    const now = new Date();
    const fmt = new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    el.textContent = `Mở dashboard lúc ${fmt.format(now)}`;
  }
})();
