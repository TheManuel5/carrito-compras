import PDFDocument from 'pdfkit';
import { Response } from 'express';

interface PDFOptions {
  titulo: string;
  subtitulo?: string;
  filtros?: string;
}

/**
 * Genera el encabezado corporativo del PDF
 */
const encabezado = (doc: PDFKit.PDFDocument, opts: PDFOptions) => {
  const empresa = process.env.EMPRESA_NOMBRE || 'Mi Tienda Online';

  // Barra de color superior
  doc.rect(0, 0, doc.page.width, 60).fill('#1e40af');

  // Nombre empresa
  doc.fillColor('#ffffff')
    .fontSize(20)
    .font('Helvetica-Bold')
    .text(empresa, 50, 15);

  doc.fontSize(11)
    .font('Helvetica')
    .text('Sistema de Gestión E-Commerce', 50, 38);

  // Título del reporte
  doc.fillColor('#1e293b')
    .fontSize(16)
    .font('Helvetica-Bold')
    .text(opts.titulo, 50, 80);

  if (opts.subtitulo) {
    doc.fontSize(11).font('Helvetica').fillColor('#64748b').text(opts.subtitulo, 50, 100);
  }

  if (opts.filtros) {
    doc.fontSize(9).fillColor('#94a3b8').text(`Filtros: ${opts.filtros}`, 50, 115);
  }

  // Fecha de generación
  doc.fontSize(9).fillColor('#64748b')
    .text(`Generado: ${new Date().toLocaleString('es-PE')}`, 0, 80, { align: 'right' });

  doc.moveDown(2);
};

/**
 * Pie de página
 */
const piePagina = (doc: PDFKit.PDFDocument) => {
  const pageCount = (doc as any).bufferedPageRange?.()?.count || 1;
  for (let i = 0; i < pageCount; i++) {
    doc.switchToPage(i);
    doc.fontSize(8).fillColor('#94a3b8')
      .text(
        `Página ${i + 1} de ${pageCount} | ${new Date().toLocaleDateString('es-PE')}`,
        50, doc.page.height - 40, { align: 'center' }
      );
  }
};

/**
 * Tabla de datos
 */
const tabla = (
  doc: PDFKit.PDFDocument,
  encabezados: string[],
  filas: string[][],
  anchos: number[]
) => {
  const startX = 50;
  let y = doc.y;
  const rowHeight = 22;

  // Encabezado
  doc.rect(startX, y, doc.page.width - 100, rowHeight).fill('#1e40af');
  doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold');
  let x = startX + 5;
  encabezados.forEach((h, i) => {
    doc.text(h, x, y + 6, { width: anchos[i], ellipsis: true });
    x += anchos[i];
  });
  y += rowHeight;

  // Filas
  filas.forEach((fila, rowIdx) => {
    if (y > doc.page.height - 80) {
      doc.addPage();
      y = 60;
    }
    doc.rect(startX, y, doc.page.width - 100, rowHeight)
      .fill(rowIdx % 2 === 0 ? '#f8fafc' : '#ffffff');
    doc.fillColor('#1e293b').fontSize(8).font('Helvetica');
    x = startX + 5;
    fila.forEach((cell, i) => {
      doc.text(String(cell || '-'), x, y + 6, { width: anchos[i] - 5, ellipsis: true });
      x += anchos[i];
    });
    y += rowHeight;
  });

  doc.y = y + 10;
};

/**
 * Reporte de órdenes del período
 */
export const generarReporteOrdenes = async (
  ordenes: any[],
  res: Response,
  filtros: string = ''
): Promise<void> => {
  const doc = new PDFDocument({ margin: 50, bufferPages: true });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="reporte-ordenes.pdf"');
  doc.pipe(res);

  encabezado(doc, { titulo: 'Reporte de Órdenes', subtitulo: 'Detalle de órdenes del período', filtros });

  // Resumen
  const totalVentas = ordenes.reduce((acc, o) => acc + Number(o.total), 0);
  doc.fillColor('#1e293b').fontSize(11).font('Helvetica-Bold').text('Resumen');
  doc.fontSize(10).font('Helvetica').fillColor('#64748b');
  doc.text(`Total de órdenes: ${ordenes.length}   |   Monto total: S/. ${totalVentas.toFixed(2)}`);
  doc.moveDown();

  tabla(
    doc,
    ['Nro. Orden', 'Fecha', 'Cliente', 'Estado', 'Items', 'Total'],
    ordenes.map((o) => [
      o.numero_orden,
      new Date(o.created_at).toLocaleDateString('es-PE'),
      `${o.usuario?.nombre || ''} ${o.usuario?.apellido || ''}`.trim(),
      o.estado.replace(/_/g, ' '),
      String(o.items?.length || 0),
      `S/. ${Number(o.total).toFixed(2)}`,
    ]),
    [100, 80, 130, 90, 50, 80]
  );

  piePagina(doc);
  doc.end();
};

/**
 * Reporte de inventario valorizado
 */
export const generarReporteInventario = async (
  productos: any[],
  res: Response
): Promise<void> => {
  const doc = new PDFDocument({ margin: 50, bufferPages: true });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="reporte-inventario.pdf"');
  doc.pipe(res);

  encabezado(doc, {
    titulo: 'Inventario Valorizado',
    subtitulo: 'Stock actual por producto y valorización',
  });

  const totalValor = productos.reduce(
    (acc, p) => acc + (p.stock?.cantidad || 0) * Number(p.precio_costo || 0), 0
  );
  doc.fillColor('#1e293b').fontSize(10).font('Helvetica-Bold')
    .text(`Valor total de inventario: S/. ${totalValor.toFixed(2)}`);
  doc.moveDown();

  tabla(
    doc,
    ['SKU', 'Producto', 'Categoría', 'Stock', 'P. Costo', 'Valor Total'],
    productos.map((p) => [
      p.sku,
      p.nombre,
      p.categoria?.nombre || '',
      String(p.stock?.cantidad || 0),
      `S/. ${Number(p.precio_costo).toFixed(2)}`,
      `S/. ${((p.stock?.cantidad || 0) * Number(p.precio_costo)).toFixed(2)}`,
    ]),
    [70, 150, 100, 50, 70, 80]
  );

  piePagina(doc);
  doc.end();
};

/**
 * Factura individual por orden
 */
export const generarFactura = async (orden: any, res: Response): Promise<void> => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="factura-${orden.numero_orden}.pdf"`);
  doc.pipe(res);

  // Encabezado
  doc.fillColor('#1e40af').fontSize(24).font('Helvetica-Bold').text('FACTURA', { align: 'center' });
  doc.moveDown(0.5);
  doc.fillColor('#64748b').fontSize(12).font('Helvetica').text(orden.numero_orden, { align: 'center' });
  doc.moveDown();

  // Datos
  doc.fillColor('#1e293b').fontSize(10).font('Helvetica-Bold').text('Datos del pedido:');
  doc.font('Helvetica').fillColor('#64748b')
    .text(`Fecha: ${new Date(orden.created_at).toLocaleDateString('es-PE')}`)
    .text(`Estado: ${orden.estado.replace(/_/g, ' ')}`)
    .text(`Método de pago: ${orden.pagos?.[0]?.metodo || 'N/A'}`);

  doc.moveDown();
  doc.fillColor('#1e293b').font('Helvetica-Bold').text('Cliente:');
  doc.font('Helvetica').fillColor('#64748b')
    .text(`${orden.usuario?.nombre} ${orden.usuario?.apellido}`)
    .text(orden.usuario?.email || '');

  if (orden.direccion_envio) {
    doc.moveDown();
    doc.fillColor('#1e293b').font('Helvetica-Bold').text('Dirección de envío:');
    const d = orden.direccion_envio;
    doc.font('Helvetica').fillColor('#64748b')
      .text(`${d.nombre} ${d.apellido}`)
      .text(`${d.direccion}, ${d.ciudad}, ${d.departamento}`);
  }

  doc.moveDown();
  // Items
  tabla(
    doc,
    ['Producto', 'SKU', 'Cant.', 'P. Unit.', 'Subtotal'],
    orden.items.map((item: any) => [
      item.nombre_producto,
      item.sku,
      String(item.cantidad),
      `S/. ${Number(item.precio_unitario).toFixed(2)}`,
      `S/. ${Number(item.subtotal).toFixed(2)}`,
    ]),
    [200, 80, 50, 80, 80]
  );

  doc.moveDown();
  const yTotales = doc.y;
  doc.fillColor('#1e293b').fontSize(10).font('Helvetica-Bold');
  doc.text(`Subtotal: S/. ${Number(orden.subtotal).toFixed(2)}`, { align: 'right' });
  doc.text(`IGV (18%): S/. ${Number(orden.igv).toFixed(2)}`, { align: 'right' });
  doc.text(`Envío: S/. ${Number(orden.costo_envio).toFixed(2)}`, { align: 'right' });
  if (Number(orden.descuento) > 0) {
    doc.fillColor('#16a34a').text(`Descuento: -S/. ${Number(orden.descuento).toFixed(2)}`, { align: 'right' });
  }
  doc.fillColor('#1e40af').fontSize(14)
    .text(`TOTAL: S/. ${Number(orden.total).toFixed(2)}`, { align: 'right' });

  doc.end();
};
