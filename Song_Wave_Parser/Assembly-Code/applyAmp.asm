; Thomas Cinalli
; Apply Amplification

.386 
.model flat,C 

applyAmplification PROTO, samples:PTR DWORD, arrSize:DWORD, amplification:REAL4

.data
	temp DWORD ?
	amp DWORD ?
	tempHolder REAL8 ?
.code 

applyAmplification PROC USES esi edi eax,    
	volumes:PTR DWORD, arrSize:DWORD, amplification:REAL4
	
	mov EDI, 0
	mov ESI, volumes
	mov ECX, arrSize					; Store array size
	finit
L1:
	fld amplification					; Stored in ST( 0 )
	mov EBX, [ esi + edi * 4 ]
	mov temp, EBX
	fld temp							; Stored in ST( 1 )
	fmul								; Multiply ST( 0 ) with the amplifcation
	fstp REAL4 PTR [ esi + edi * 4 ]
	inc EDI

loop L1
	ret
applyAmplification ENDP
END