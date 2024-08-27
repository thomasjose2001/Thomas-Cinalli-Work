; Thomas Cinalli
; Amplification Factor

.386 
.model flat,C 

amplificationFactor PROTO, samples:PTR DWORD, arrSize:DWORD, amplification:REAL4

.data
	temp DWORD ?
	amp DWORD ?
	tempHolder REAL8 ?
.code 

amplificationFactor PROC USES esi edi eax,    
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
	fdiv ST( 1 ), ST( 0 )				; Multiply ST( 0 ) with the amplifcation
	fstp tempHolder
	fstp REAL4 PTR [ esi + edi * 4 ]
	inc EDI

	fstp tempHolder						; Pop the new value in a temp 
loop L1
	ret
amplificationFactor ENDP
END