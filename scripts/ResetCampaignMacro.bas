Attribute VB_Name = "ResetCampaignModule"
' ===================================================================
' SENSUlKAN DELUXE: RESET CAMPAIGN MACRO (VBA)
' Borra todos los contactos de combate, patrullas y heridas, dejando
' el libro a 0 listo para una nueva partida.
' ===================================================================

Sub ResetCampaignToZero()
    Dim wsCombat As Worksheet
    Dim wsPatrol As Worksheet
    Dim wsCrew As Worksheet
    Dim r As Long
    Dim ans As VbMsgBoxResult

    ans = MsgBox("¿Deseas reiniciar toda la campaña a CERO?" & vbCrLf & vbCrLf & _
                 "Se borrarán todos los blancos de combate registrados, fechas de patrulla y bajas de tripulación.", _
                 vbYesNo + vbExclamation, "Sensuikan: Reiniciar Registro")
                 
    If ans <> vbYes Then Exit Sub

    On Error Resume Next
    Application.ScreenUpdating = False

    ' 1. Limpiar Hoja COMBAT & ENCOUNTERS
    Set wsCombat = ThisWorkbook.Sheets("COMBAT & ENCOUNTERS")
    If Not wsCombat Is Nothing Then
        For r = 7 To 60
            wsCombat.Range("A" & r).Value = ""            ' Nº Patrulla
            wsCombat.Range("C" & r).Value = ""            ' Fecha
            wsCombat.Range("D" & r).Value = ""            ' Zona
            wsCombat.Range("E" & r).Value = "Merchant"   ' Categoría
            wsCombat.Range("F" & r).Value = ""            ' Nombre del buque
            wsCombat.Range("G" & r).Value = "USA"         ' Nación
            wsCombat.Range("H" & r).Value = 0             ' Tonelaje
            wsCombat.Range("I" & r).Value = "Submerged Day Torpedo"
            wsCombat.Range("J" & r).Value = "Sunk"
            wsCombat.Range("K" & r).Value = 0             ' Impactos
            wsCombat.Range("L" & r).Value = 0             ' Disparados
            wsCombat.Range("M" & r).Value = "No escorts present"
            wsCombat.Range("N" & r).Value = ""            ' Notas
        Next r
    End If

    ' 2. Limpiar Hoja PATROL LOG SHEET (Filas 15 a 38)
    Set wsPatrol = ThisWorkbook.Sheets("PATROL LOG SHEET")
    If Not wsPatrol Is Nothing Then
        For r = 15 To 38
            wsPatrol.Range("B" & r).Value = ""            ' Fecha
            wsPatrol.Range("C" & r).Value = ""            ' Base Salida
            wsPatrol.Range("D" & r).Value = ""            ' Zona Operativa
            wsPatrol.Range("E" & r).Value = 3             ' Meses
            wsPatrol.Range("F" & r).Value = "War Patrol"  ' Misión
            wsPatrol.Range("G" & r).Value = ""            ' Fases
            wsPatrol.Range("L" & r).Value = "None"        ' Munición
            wsPatrol.Range("M" & r).Value = "No Sortie"   ' Hidroavión
            wsPatrol.Range("N" & r).Value = "None"        ' Daños
            wsPatrol.Range("O" & r).Value = 1             ' Reparación
            wsPatrol.Range("P" & r).Value = ""            ' Base Llegada
        Next r
    End If

    ' 3. Limpiar Hoja CREW & OFFICERS ROSTER
    Set wsCrew = ThisWorkbook.Sheets("CREW & OFFICERS ROSTER")
    If Not wsCrew Is Nothing Then
        For r = 5 To 20
            wsCrew.Range("F" & r).Value = "Fit for Duty"  ' Salud
            wsCrew.Range("H" & r).Value = 0               ' Heridas
        Next r
    End If

    Application.ScreenUpdating = True
    MsgBox "¡Campaña reiniciada con éxito!" & vbCrLf & _
           "Todos los contadores, patrullas y tonelaje están a CERO.", _
           vbInformation, "Sensuikan: Reinicio Completado"
End Sub
