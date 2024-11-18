<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <style>
        @page {
            size: landscape;
            margin: 20mm;
        }

        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            font-size: 12px;
        }

        .header {
            margin-bottom: 15px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }

        .header-logos {
            width: 100%;
            border-collapse: collapse;
        }

        .header-logos td {
            border: none;
            vertical-align: middle;
        }

        .logo-cell {
            width: 80px;
        }

        .header-logos img {
            width: 100px;
        }

        .title-cell {
            text-align: center;
            padding: 0 20px;
        }

        /* Tabla principal más compacta */
        .main-table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
            font-size: 12px;
            table-layout: fixed; /* Establece un diseño fijo para la tabla */
        }

        .main-table th {
            background-color: #f4f4f4;
            font-weight: bold;
            padding: 6px;
            font-size: 12px;
        }

        .main-table td {
            padding: 6px;
            font-size: 12px;
        }

        .main-table,
        .main-table th,
        .main-table td {
            border: 1px solid #ddd;
            text-align: left;
        }

        .signatures {
            width: 100%;
            margin-top: 30px;
        }

        .signatures-table {
            width: 100%;
            border-collapse: collapse;
        }

        .signature-cell {
            width: 33.33%;
            text-align: center;
            padding: 15px;
            border: none;
        }

        .signature-line {
            border-top: 1px solid #000;
            width: 80%;
            margin: 30px auto 10px auto;
        }

        h1, h2, h3, h4, h5, h6 {
            margin-top: 3px;
            margin-bottom: 3px;
        }

        p {
            font-size: 12px;
            margin: 5px 0;
        }

        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin: 5px 0;
        }

        .info-table td {
            border: none;
            padding: 3px;
            font-size: 12px;
        }

        /* Nuevo estilo para el total */
        .total-container {
            width: 100%;
            margin-top: 5px;
            margin-bottom: 5px;
        }

        .total-box {
            float: right;
            border: 1px solid #ddd;
            padding: 6px 12px;
            background-color: #f4f4f4;
            width: auto;
        }

        /* Estilo para el área de observaciones */
        .observations-box {
            width: 100%;
            height: 14px; /* Ajustamos la altura a 14px */
            border: 1px solid #ddd;
            margin-top: 40px;
            padding: 6px;
            box-sizing: border-box; /* Asegura que el padding no afecte el tamaño total */
        }
    </style>
</head>

<body>
    <div class="header">
        <table class="header-logos">
            <tr>
                <td class="logo-cell">
                    <img src="{{ $logoPath }}" alt="Logo">
                </td>
                <td class="title-cell">
                    <h5>TECNOLÓGICO NACIONAL DE MÉXICO</h5>
                    <h6>INSTITUTO TECNOLÓGICO SUPERIOR DE JEREZ</h6>
                    <h6>REQUISICIÓN DE BIENES Y SERVICIOS</h6>
                </td>
                <td class="logo-cell" style="text-align: right;">
                    <img src="{{ $logoPath2 }}" alt="Logo">
                </td>
            </tr>
        </table>
    </div>

    <table class="info-table">
        <tr>
            <td style="text-align: left;">FECHA DE SOLICITUD: {{ $folio->fecha_solicitud }}</td>
            <td style="text-align: right;">FOLIO No.: {{ $folio->folio }}</td>
        </tr>
    </table>

    <div class="header-info">
        <h4>Reporte de Folio: {{ $folio->folio }}</h4>
        <p>NOMBRE DEL JEFE(A) ÁREA SOLICITANTE: MMMD. MANUEL IVAN GALLEGOS PÉREZ</p>
        <p>FECHA DE ENTREGA Y AREA SOLICITANTE: {{ $folio->fecha_entrega }} DEPARTAMENTO DE DESARROLLO ACADÉMICO</p>
        <p>Los Bienes o Servicios están contemplados en el Programa Operativo Anual: Si [ * ] No [  ]</p>
    </div>

    <main>
        <table class="main-table">
            <thead>
                <tr>
                    <th>Partida Presupuestal</th>
                    <th>Cantidad</th>
                    <th>Unidad</th>
                    <th>Descripción de los bienes o servicios</th>
                    <th>Costo Estimado TOTAL + IVA</th>
                    <th>Firma de confirmidad de entregado</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($requisiciones as $requisicion)
                    <tr>
                        <td>{{ $requisicion->partida_presupuestal }}</td>
                        <td>{{ $requisicion->cantidad }}</td>
                        <td>{{ $requisicion->unidad }}</td>
                        <td>{{ $requisicion->descripcion_bienes_servicios }}</td>
                        <td>${{ number_format($requisicion->costo_estimado, 2) }}</td>
                        <td></td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div class="total-container">
            <div class="total-box">
                <strong>Total: ${{ number_format($folio->total_estimado, 2) }}</strong>
            </div>
        </div>

        <div class="observations-box"></div>
    </main>

    <div class="signatures">
        <table class="signatures-table">
            <tr>
               
                    <td class="signature-cell">
                        <p>REVISA</p>
                        <p> NOMBRE Y FIRMA</p>
                        <div class="signature-line"></div>
                        <p>SUBDIRECTOR DE PLANEACIÓN Y VINCULACIÓN <br/>
                        MTRO, CRISTÓBAL HERNÁNDEZ GUERRA</p>
                    </td>
                    <td class="signature-cell">
                        <p>REVISA</p>
                        <p> NOMBRE Y FIRMA</p>
                        <div class="signature-line"></div>
                        <p>SUBDIRECTOR DE SERVICIOS ADMINISTRATIVOS <br/>
                        LIC. CARLOS ISRAEL HERNÁNDEZ GUERRA</p>
                    </td>
                    <td class="signature-cell">
                        <p>REVISA</p>
                        <p> NOMBRE Y FIRMA</p>
                        <div class="signature-line"></div>
                        <p>DIRECTOR GENERAL <br/>
                        </p>
                    </td>

            </tr>
        </table>
    </div>
</body>

</html>
