; Thomas Cinalli
; Calculate Average
.386 
.model flat,C 

caluculateAvg PROTO, blocks:PTR DWORD, arrSize:DWORD

.data
	temp DWORD ?
	additionAvg REAL4 0.0
	tempFloat REAL4 0.0
	helper REAL4 0.0
	trashHolder REAL4 ?
	divideSize DWORD ?
.code 

caluculateAvg PROC USES esi edi, 
	blocks:PTR DWORD, arrSize:DWORD

	mov ECX, arrSize
	mov ESI, blocks
	mov EDI, 0

	mov divideSize, ECX
	add divideSize, ECX					

	finit
	fld helper							; Push 0 into the stack as a helper
L1:
	mov EBX, [ esi + edi * 4 ]
	mov temp, EBX
	fld temp							; Push the array element into the stack							
	fabs								; Take the absolute value
	inc EDI								; Increment EDI for the next array element 
	fstp additionAvg

	mov EBX, [ esi + edi * 4 ]
	mov temp, EBX
	fld temp							; Store next array element into the stack
	fabs
	inc EDI

	fadd additionAvg
	fadd ST( 1 ), ST( 0 )				; Add ST0 and ST1
	fstp trashHolder

loop L1
	fidiv divideSize
	ret

caluculateAvg ENDP
END