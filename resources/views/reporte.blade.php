<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <style>
        @page {
            size: landscape;
            margin: 15mm; /* Reducir márgenes generales */
        }

        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            font-size: 12px; /* Reducir tamaño de fuente */
        }

        .header {
            margin-bottom: 5px; /* Reducir espacio debajo del encabezado */
            padding-bottom: 5px; /* Reducir padding del header */
        }

        .header-logos {
            width: 100%;
            border-collapse: collapse;
        }

        .header-logos td {
            border: none;
            vertical-align: middle;
            padding: 0; /* Eliminar padding para reducir espacio */
        }

        .logo-cell {
            width: 80px;
        }

        .header-logos img {
            width: 80px; /* Ajustar tamaño de logo */
        }

        .title-cell {
            text-align: center;
            padding: 0 10px; /* Reducir padding */
        }

        .main-table {
            width: 100%;
            border-collapse: collapse;
            margin: 5px 0;
            box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
            font-size: 12px; /* Reducir tamaño de fuente */
            table-layout: fixed;
        }

        .main-table th,
        .main-table td {
            border: 1px solid #ddd;
            padding: 4px; /* Reducir padding en celdas */
            font-size: 12px; /* Reducir tamaño de fuente */
        }

        .signatures-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
        }

        .signature-cell {
            width: 33.33%;
            text-align: center;
            padding: 12px; /* Reducir padding */
            border: none;
        }

        .signature-line {
            border-top: 1px solid #000;
            width: 80%;
            margin: 10px auto; /* Reducir margen */
        }

        .info-table td {
            border: none;
            padding: 3px;
            font-size: 12px; /* Reducir tamaño de fuente */
        }


        h1, h2, h3, h4, h5, h6, p {
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
        <!-- mostrarlo en mayusculas -->
        <p>NOMBRE DEL JEFE(A) ÁREA SOLICITANTE: {{ strtoupper($nombreJefeArea)}}</p>
        <p>FECHA DE ENTREGA Y AREA SOLICITANTE: {{ $folio->fecha_entrega }} {{ strtoupper($nombreAreaSolicitante) }}</p>
        <p>Los Bienes o Servicios están contemplados en el Programa Operativo Anual: Si [ * ] No [ ]</p>
    </div>

    <main>
        <table class="main-table">
            <thead>
                <tr>
                    <th>PROYECTO, ACTIVIDAD y ACCIÓN</th>
                    <th>Partida Presupuestal</th>
                    <th>Cantidad</th>
                    <th>Unidad</th>
                    <th>Descripción de los bienes o servicios</th>
                    <th>Costo Estimado TOTAL + IVA</th>
                    <th>Firma de conformidad de entregado</th>
                </tr>
            </thead>
            <tbody>
                @php
                    // Contamos cuántas requisiciones hay para saber cuántas filas van a compartir el mismo Proyecto/Acción/etc.
                    $totalRequisiciones = count($requisiciones);
                    $currentIndex = 0;
                    $totalCostoEstimado = 0; // Variable para calcular el total de costos estimados
                    $totalCantidad = 0; // Variable para calcular el total de cantidades
                @endphp

                @foreach ($requisiciones as $requisicion)
                    <tr>
                        @if ($currentIndex == 0) <!-- Para la primera requisición -->
                            <td rowspan="{{ $totalRequisiciones }}">
                                <p><strong>Objetivo:</strong> {{ $objetivo }}</p>
                                <p><strong>Línea de Acción:</strong> {{ $lineaAccion }}</p>
                                <p><strong>Proyecto:</strong> {{ $proyecto }}</p>
                                <p><strong>Acción:</strong> {{ $accion }}</p>
                            </td>
                        @endif
                        <td>{{ $requisicion->partida_presupuestal }}</td>
                        <td>{{ $requisicion->cantidad }}</td>
                        <td>{{ $requisicion->unidad }}</td>
                        <td>{{ $requisicion->descripcion_bienes_servicios }}</td>
                        <td>${{ number_format($requisicion->costo_estimado, 2) }}</td>
                        <td></td>
                    </tr>

                    @php
                        // Acumulamos los valores para el total
                        $totalCostoEstimado += $requisicion->costo_estimado;
                        $totalCantidad += $requisicion->cantidad;
                        $currentIndex++;
                    @endphp
                @endforeach

                <!-- Agregamos la fila con el total y la cantidad -->
                <tr>
                    <td colspan="4"></td>
                    <td><strong>Total</strong></td>
                    <td><strong>${{ number_format($totalCostoEstimado, 2) }}</strong></td>
                    <td></td>
                </tr>
            </tbody>
        </table>

        <table class="main-table">
            <tbody>
                <tr>
                    <td>LO ANTERIOR PARA SER UTILIZADO EN: {{ strtoupper($loAnterior) }}</td> <!-- Mostrar el dato recibido -->
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
                        <p> NOMBRE Y FIRMA</p>
                        <div class="signature-line"></div>
                        <p>{!! $firma !!}</p>
                    </td>
                @endforeach
            </tr>
        </table>
    </div>
</body>

</html>
