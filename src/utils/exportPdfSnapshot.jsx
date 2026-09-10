export const exportPdfSnapshot = ({ matter, nodes, selectedNode }) => {
  const printWindow = window.open('', '_blank', 'width=1200,height=900');
  if (!printWindow) {
    alert('Please allow popups for this site to export the PDF snapshot.');
    return;
  }

  const exportDate = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const nodesHtml = nodes.map(n => `
    <div style="
      display: inline-block;
      vertical-align: top;
      width: 220px;
      margin: 8px;
      padding: 10px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    ">
      <div style="font-size: 11px; font-weight: 800; color: #0f172a;">${n.label}</div>
      <div style="font-size: 9.5px; color: #64748b; margin-top: 2px;">${n.sub}</div>
      <div style="margin-top: 6px; font-size: 9px; color: #334155; border-top: 1px solid #f1f5f9; padding-top: 4px;">
        <b>Role:</b> ${n.assignedTask || 'N/A'}<br/>
        <b>Status:</b> ${n.status || 'Active'}<br/>
        <b>Coord:</b> (${n.x}, ${n.y})
      </div>
    </div>
  `).join('');

  const linksHtml = matter.links.map(l => {
    const fromNode = nodes.find(n => n.id === l.from);
    const toNode = nodes.find(n => n.id === l.to);
    return `
      <tr>
        <td style="padding: 6px 10px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${fromNode ? fromNode.label : l.from}</td>
        <td style="padding: 6px 10px; border-bottom: 1px solid #e2e8f0; color: #4f35b8; font-weight: 700; font-size: 10px;">${l.label || 'CONNECTS TO'}</td>
        <td style="padding: 6px 10px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${toNode ? toNode.label : l.to}</td>
      </tr>
    `;
  }).join('');

  const sequenceHtml = matter.sequence.map(s => `
    <div style="
      display: inline-block;
      vertical-align: top;
      min-width: 130px;
      margin: 4px;
      padding: 8px 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
    ">
      <div style="font-weight: 800; font-size: 11px; color: #4f35b8;">Step ${s.step}</div>
      <div style="font-weight: 700; font-size: 10px; color: #0f172a; margin-top: 2px;">${s.title}</div>
      <div style="font-size: 8.5px; color: #64748b;">${s.time}</div>
    </div>
  `).join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>EBRR TRACE™ Investigation Snapshot — ${matter.title}</title>
        <style>
          @page {
            size: landscape;
            margin: 12mm 15mm;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            color: #0f172a;
            background: #ffffff;
            margin: 0;
            padding: 16px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #4f35b8;
            padding-bottom: 12px;
            margin-bottom: 18px;
          }
          .header h1 {
            font-size: 20px;
            font-weight: 800;
            margin: 0 0 4px;
            color: #091224;
          }
          .header p {
            margin: 0;
            font-size: 12px;
            color: #475569;
          }
          .meta-box {
            text-align: right;
            font-size: 10px;
            color: #64748b;
          }
          .meta-box b {
            color: #0f172a;
          }
          .section-title {
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #4f35b8;
            margin: 16px 0 8px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 4px;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10.5px;
            margin-top: 6px;
          }
          .table th {
            background: #f1f5f9;
            text-align: left;
            padding: 6px 10px;
            font-weight: 700;
            color: #334155;
            border-bottom: 1px solid #cbd5e1;
          }
          .btn-print {
            position: fixed;
            top: 16px;
            right: 16px;
            padding: 8px 16px;
            background: #4f35b8;
            color: #fff;
            border: none;
            border-radius: 6px;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          }
          @media print {
            .btn-print { display: none; }
          }
        </style>
      </head>
      <body>
        <button class="btn-print" onclick="window.print()">🖨️ Print to PDF</button>

        <div class="header">
          <div>
            <h1>${matter.title}</h1>
            <p>EBRR TRACE™ Matter Reconstruction · Snapshot & Responsibility Analysis</p>
          </div>
          <div class="meta-box">
            <div>Export Date: <b>${exportDate}</b></div>
            <div>Investigator: <b>Legal Assistant (LA)</b></div>
            <div>Total Entities: <b>${nodes.length}</b> | Edges: <b>${matter.links.length}</b></div>
          </div>
        </div>

        <div class="section-title">1. Reconstructed Activity Sequence</div>
        <div style="margin-bottom: 14px;">
          ${sequenceHtml}
        </div>

        <div class="section-title">2. Canvas Entities (Current Dragged Spatial State)</div>
        <div style="margin-bottom: 14px;">
          ${nodesHtml}
        </div>

        <div class="section-title">3. Canonical Relationships & Legal Flow</div>
        <table class="table">
          <thead>
            <tr>
              <th style="width: 35%;">From Entity / Object</th>
              <th style="width: 30%;">Canonical Relationship</th>
              <th style="width: 35%;">To Entity / Target</th>
            </tr>
          </thead>
          <tbody>
            ${linksHtml}
          </tbody>
        </table>

        ${selectedNode && selectedNode.trace ? `
          <div class="section-title">4. Focused TRACE Findings · ${selectedNode.label}</div>
          <table class="table">
            <thead>
              <tr>
                <th style="width: 25%;">TRACE Dimension</th>
                <th style="width: 55%;">Source-Supported Finding</th>
                <th style="width: 20%;">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 6px 10px; font-weight: 700;">Responsibility</td>
                <td style="padding: 6px 10px;">${selectedNode.trace.responsibility.text}</td>
                <td style="padding: 6px 10px;"><b>${selectedNode.trace.responsibility.status}</b></td>
              </tr>
              <tr>
                <td style="padding: 6px 10px; font-weight: 700;">Authority</td>
                <td style="padding: 6px 10px;">${selectedNode.trace.authority.text}</td>
                <td style="padding: 6px 10px;"><b>${selectedNode.trace.authority.status}</b></td>
              </tr>
              <tr>
                <td style="padding: 6px 10px; font-weight: 700;">Control</td>
                <td style="padding: 6px 10px;">${selectedNode.trace.control.text}</td>
                <td style="padding: 6px 10px;"><b>${selectedNode.trace.control.status}</b></td>
              </tr>
              <tr>
                <td style="padding: 6px 10px; font-weight: 700;">Evidence</td>
                <td style="padding: 6px 10px;">${selectedNode.trace.evidence.text}</td>
                <td style="padding: 6px 10px;"><b>${selectedNode.trace.evidence.status}</b></td>
              </tr>
            </tbody>
          </table>
        ` : ''}

        <script>
          setTimeout(() => {
            window.print();
          }, 450);
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};
