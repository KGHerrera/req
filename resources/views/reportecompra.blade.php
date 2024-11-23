<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <style>
        @page {
            size: landscape;
            margin: 15mm;
        }

        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            font-size: 12px;
        }

        .header {
            text-align: center;
            margin-bottom: 5px;
            padding-bottom: 5px;
        }

        .header-logos {
            width: 100%;
            border-collapse: collapse;
        }

        .header-logos td {
            border: none;
            vertical-align: middle;
            padding: 0;
        }

        .logo-cell {
            width: 80px;
        }

        .header-logos img {
            width: 80px;
        }

        .title-cell {
            text-align: center;
            padding: 0 10px;
        }

        .main-table {
            width: 100%;
            border-collapse: collapse;
            margin: 5px 0;
            box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
            font-size: 12px;
            table-layout: fixed;
        }

        .main-table th,
        .main-table td {
            border: 1px solid #ddd;
            padding: 4px;
            font-size: 12px;
        }

        .info-table td {
            border: none;
            padding: 3px;
            font-size: 12px;
        }

        .signatures-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
        }

        .signature-cell {
            width: 33.33%;
            text-align: center;
            padding: 12px;
            border: none;
        }

        .signature-line {
            border-top: 1px solid #000;
            width: 80%;
            margin: 10px auto;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        p {
            margin-bottom: 3px;
            margin-top: 0;
            padding: 0;
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
                </td>
                <td class="logo-cell" style="text-align: right;">
                    <img src="{{ $logoPath2 }}" alt="Logo">
                </td>
            </tr>
        </table>
    </div>

    <div class="header">
        <h4>DEPARTAMENTO DE RECURSOS MATERIALES</h4>
        <h4>ORDEN DE COMPRA DE ADQUISICIONES DEL BIEN O SERVICIO</h4>
    </div>

    <table class="info-table">
        <tr>
            <td style="text-align: left;">PROVEEDOR: {{ $proveedor }}</td>
            <td style="text-align: right;">No. DE ORDEN DE COMPRA: {{ $noOrdenCompra }}</td>
        </tr>
        <tr>
            <td style="text-align: left;">FECHA: {{ $fechaActual }}</td>
            <td style="text-align: right;">FECHA DE ENTREGA DEL BIEN O SERVICIO: {{ $fechaEntrega }}</td>
        </tr>
    </table>

    <main>
        <table class="main-table">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Cantidad</th>
                    <th>Unidad</th>
                    <th>Descripción</th>
                    <th>Área Solicitante</th>
                    <th>No. Requisición</th>
                    <th>Precio Unitario</th>
                    <th>Importe Parcial</th>
                </tr>
            </thead>
            <tbody>
                @php
                    $totalImporte = 0;
                    $counter = 1;
                @endphp
                @foreach ($ordenes_compra as $orden)
                                <tr>
                                    <td>{{ $counter }}</td>
                                    <td>{{ $orden->requisicion->cantidad }}</td>
                                    <td>{{ $orden->requisicion->unidad }}</td>
                                    <td>{{ $orden->requisicion->descripcion_bienes_servicios }}</td>
                                    <td>{{ $areaSolicitante }}</td>
                                    <td>{{ $orden->id_requisicion }}</td>
                                    <td>${{ number_format($orden->requisicion->costo_estimado, 2) }}</td>
                                    <td>${{ number_format($orden->requisicion->cantidad * $orden->requisicion->costo_estimado, 2) }}
                                    </td>
                                </tr>
                                @php
                                    $totalImporte += $orden->requisicion->cantidad * $orden->requisicion->costo_estimado;
                                    $counter++;
                                @endphp
                @endforeach

                <tr>
                    <td colspan="7" style="text-align: right;"><strong>Total</strong></td>
                    <td><strong>${{ number_format($totalImporte, 2) }}</strong></td>
                </tr>
            </tbody>
        </table>
    </main>

    <div class="signatures">
        <table class="signatures-table">
            <tr>
                @foreach ($firmas as $firma)
                    <td class="signature-cell">
                        <p>REVISA</p>
                        <p>NOMBRE Y FIRMA</p>
                        <div class="signature-line"></div>
                        <p>{!! $firma !!}</p>
                    </td>
                @endforeach
            </tr>
        </table>
    </div>
</body>

</html>