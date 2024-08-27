; Thomas Cinalli
; Reference Volume

.386 
.model flat,C 

referenceVolume PROTO, volumes:PTR DWORD, arrSize:DWORD

.data
	temp DWORD ?
	biggestVal REAL8 ?
	tempHolder REAL8 ?
	trashHolder REAL8 ?
.code 

referenceVolume PROC USES esi edi,  
	volumes:PTR DWORD, arrSize:DWORD

	mov EDI, 0
	mov ESI, volumes
	mov ECX, arrSize
	sub ECX, 1
	finit
	
	mov EBX, [ esi + edi * 4 ]			
	mov temp, EBX
	fld temp							; Push first array element into the FPU registers
	fabs
	inc EDI

	fst biggestVal						; Store ST( 0 ) as the biggest value
	fstp trashHolder					; Pop ST( 0 ) from the stack 
L1:
	mov EBX, [ esi + edi * 4 ]
	mov temp, EBX
	fld temp
	fabs
	inc EDI

	fcom biggestVal						; Compare biggestVal with the most recent push
	fnstsw AX
	sahf
jb SWAPS	
	fst biggestVal					    ; Store the new best value 
SWAPS:	fstp trashHolder				; Empty stack
loop L1
	fld biggestVal
	ret
referenceVolume ENDP
END