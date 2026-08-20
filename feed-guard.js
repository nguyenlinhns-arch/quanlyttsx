(function(){
  'use strict';
  const baseAudit=auditConsistency;
  auditConsistency=function(){
    const rawCompanies=new Set((state.rows||[]).map(r=>norm(r.company)).filter(Boolean));
    const summaryCompanies=(state.companySummary||[]).filter(x=>x&&x.name&&norm(x.name)!=='tong cong');
    if(rawCompanies.size!==15||summaryCompanies.length!==15){
      throw new Error(`Feed chưa đủ 15 doanh nghiệp (${rawCompanies.size}/15 chi tiết; ${summaryCompanies.length}/15 thống kê). Đang dùng snapshot dự phòng.`);
    }
    const a=baseAudit();
    if(!a.ok) throw new Error(a.message||'Feed chưa qua đối soát.');
    return a;
  };
})();
