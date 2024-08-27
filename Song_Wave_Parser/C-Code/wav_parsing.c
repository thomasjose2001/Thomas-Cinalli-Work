/* Thomas Cinalli
 C-Program for Wave Parsing
 */

#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>

#define MAX_ITEM_SIZE 200
#define SAMPLES_PER_BLOCK 4410
#define TOTAL_BLOCKS 2846
#define MAX_ALLOCATION 3000

float caluculateAvg ( float* blocks, int SIZE ) {									/* Calculate Average */

	float AVG = 0.0;

	for ( int i = 0; i < SIZE; i++ )
		AVG += fabsf ( blocks[ i ] );												/* Add on to the average with the absolute value of the samples contained in a block */

	AVG = AVG / ( float ) SIZE;
	return AVG;
}

float referenceVolume ( float* volumes, int SIZE ) {								/* Reference Volume */

	float biggestVolume = volumes[ 0 ];

	for ( int i = 1; i < SIZE; i++ ) {

		if ( volumes[ i ] > biggestVolume )											/* Find the biggest block size */
			biggestVolume = volumes[ i ];
	}
	return biggestVolume;
}

float amplificationFactor ( float blockAvg[ ], int Size, float referenceVol ) {		/* Amplification Factor  */

	for ( int i = 0; i < Size; i++ ) {

		blockAvg[ i ] = ( referenceVol / blockAvg[ i ] );							/* Calculate the amplification factor for each block */
	}
}

void applyAmplification ( float samples[ ], int SIZE, float amplification ) {		/* Apply Amplification */

	for ( int i = 0; i < SIZE; i++ ) {

		samples[ i ] *= amplification;												/* Add on the amplification to all samples */
	}
}

int main ( void ) {

	FILE* infile;
	FILE* outfile;

	char item[ MAX_ITEM_SIZE ];

	int	chunk_size;
	int subchunk_size;
	int processed_bytes = 0;

	short shortint;

	int longint;
	int k = 0;
	int j = 0;
	int l = 0;

	float* psamples;

	float* leftPoints = malloc ( sizeof ( float ) * MAX_ALLOCATION );		/* Allocate for left points */
	float* rightPoints = malloc ( sizeof ( float ) * MAX_ALLOCATION );	/* Allocate for right points */

	infile = fopen ( "Kid A.wav", "rb" );
	outfile = fopen ( "KidFinal A.wav", "wb" );
	if ( infile == NULL )
	{
		printf ( "Could not open file! \n" );
		return ( -1 );
	}

	if ( outfile == NULL ) {

		printf ( "Could not open file! \n" );
		return( -1 );
	}

	/* Chunk ID: 4-byte string */
	fread ( item, 4, 1, infile );
	fwrite ( item, 4, 1, outfile );

	item[ 4 ] = 0;
	printf ( "Chunk ID: %s\n", item );

	/* Chunk size: 32-bit int */
	fread ( &chunk_size, 4, 1, infile );
	printf ( "Chunk size: %d\n", chunk_size );

	fwrite ( &chunk_size, 4, 1, outfile );

	/* Chunk format: 4-byte string */
	fread ( item, 4, 1, infile );
	fwrite ( item, 4, 1, outfile );

	item[ 4 ] = 0;
	printf ( "Chunk format: %s\n", item );
	processed_bytes = 4;

	/* Now we will process sub-chunks */
	while ( processed_bytes < chunk_size ) {

		/* Subchunk ID: 4-byte string */
		fread ( item, 4, 1, infile );
		fwrite ( item, 4, 1, outfile );

		item[ 4 ] = 0;
		printf ( "Subchunk ID: %s\n", item );
		processed_bytes += 4;

		/* Subchunk size: 32-bit int */
		fread ( &subchunk_size, 4, 1, infile );
		fwrite ( &subchunk_size, 4, 1, outfile );

		printf ( "  Subchunk size: %d\n", subchunk_size );
		processed_bytes += 4;

		/* Process subchunk data */
		if ( strcmp ( item, "fmt " ) == 0 )
		{
			/* Audio format: 2-byte integer */
			fread ( &shortint, 2, 1, infile );
			fwrite ( &shortint, 2, 1, outfile );
			printf ( "  Audio format: %d\n", shortint );

			/* Number of channels: 2-byte integer */
			fread ( &shortint, 2, 1, infile );
			fwrite ( &shortint, 2, 1, outfile );

			printf ( "  Number of channels: %d\n", shortint );

			/* Sample rate: 4-byte integer */
			fread ( &longint, 4, 1, infile );
			fwrite ( &longint, 4, 1, outfile );

			printf ( "  Sample rate: %d\n", longint );

			/* Byte rate: 4-byte integer */
			fread ( &longint, 4, 1, infile );
			fwrite ( &longint, 4, 1, outfile );

			printf ( "  Byte rate: %d\n", longint );

			/* Block alignment: 2-byte integer */
			fread ( &shortint, 2, 1, infile );
			fwrite ( &shortint, 2, 1, outfile );

			printf ( "  Block alignment: %d\n", shortint );

			/* Bits per sample: 2-byte integer */
			fread ( &shortint, 2, 1, infile );
			fwrite ( &shortint, 2, 1, outfile );

			printf ( "  Bits per sample: %d\n", shortint );
		}
		else if ( strcmp ( item, "data" ) == 0 ) {

			printf ( "Reading data samples\n" );

			/* Read samples in one shot
			 * Note that samples come interleaved for the two channels (left,right,left,right,...)
			*/

			psamples = ( float* ) malloc ( subchunk_size );
			fread ( psamples, subchunk_size, 1, infile );

			printf ( "amount: %d\n", ( subchunk_size / 4 ) );

			float** samplesLeft = malloc ( sizeof ( float* ) * MAX_ALLOCATION ); 								/* Array of pointers to float arrays */
			float** samplesRight = malloc ( sizeof ( float* ) * MAX_ALLOCATION );								/* Allocate enough memory for all samples of size 4410 */

			for ( int i = 0; i < MAX_ALLOCATION; i++ ) {														/* Allocate for each array in the array of pointers */
																												/* 4410 corresponds to amount of samples that fit in 100ms */
				samplesLeft[ i ] = malloc ( sizeof ( float ) * SAMPLES_PER_BLOCK );
				samplesRight[ i ] = malloc ( sizeof ( float ) * SAMPLES_PER_BLOCK );
			}

			for ( int i = 0; i < ( subchunk_size / 4 ); i++ ) {										/* Iterate over subchunk_size / 4 ( sizeof( float ) ) */

				samplesLeft[ k ][ j ] = psamples[ i ];												/* Put left and right samples in the array of pointers */
				samplesRight[ k ][ j++ ] = psamples[ i + 1 ];

				i++;
				if ( j == SAMPLES_PER_BLOCK ) {

					j = 0;
					k++;
				}
			}

			clock_t begin = clock ( );
			for ( int i = 0; i < TOTAL_BLOCKS; i++ ) {

				leftPoints[ i ] = caluculateAvg ( samplesLeft[ i ], SAMPLES_PER_BLOCK );
				rightPoints[ i ] = caluculateAvg ( samplesRight[ i ], SAMPLES_PER_BLOCK );							/* Calculate the average for samples of length 4410 */
			}

			clock_t end = clock ( );
			double time_spent_calc_avg = ( double ) ( end - begin ) / CLOCKS_PER_SEC;

			begin = clock ( );

			float greatestVolLeft = referenceVolume ( leftPoints, TOTAL_BLOCKS );								/* Calculate the referece Volume of both the left points and the right points */
			float greatestVolRight = referenceVolume ( rightPoints, TOTAL_BLOCKS );

			end = clock ( );
			double time_spent_reference_vol = ( double ) ( end - begin ) / CLOCKS_PER_SEC;

			begin = clock ( );

			amplificationFactor ( leftPoints, TOTAL_BLOCKS, greatestVolLeft );									/* Amplification Factor for left points and right points */
			amplificationFactor ( rightPoints, TOTAL_BLOCKS, greatestVolRight );

			end = clock ( );
			double time_spent_amplification_factor = ( double ) ( end - begin ) / CLOCKS_PER_SEC;

			begin = clock ( );

			for ( int i = 0; i < TOTAL_BLOCKS; i++ ) {

				applyAmplification ( samplesLeft[ i ], SAMPLES_PER_BLOCK, leftPoints[ i ] );							/* Iterate over block size - 1 and create new left and right samples */
				applyAmplification ( samplesRight[ i ], SAMPLES_PER_BLOCK, rightPoints[ i ] );
			}
			end = clock ( );
			double time_spent_apply_amplification = ( double ) ( end - begin ) / CLOCKS_PER_SEC;

			int h = 0;
			for ( int i = 0; i < TOTAL_BLOCKS; i++ ) {

				for ( int j = 0; j < SAMPLES_PER_BLOCK; j++ ) {

					psamples[ h++ ] = samplesLeft[ i ][ j ];											/* Put left and right samples back into psamples array */
					psamples[ h++ ] = samplesRight[ i ][ j ];
				}
			}

			fwrite ( psamples, subchunk_size, 1, outfile );												/* Write all samples to the new file */

			printf ( "calculate average: %f\n", time_spent_calc_avg );
			printf ( "reference volume: %f\n", time_spent_reference_vol );
			printf ( "amplification factor: %f\n", time_spent_amplification_factor );
			printf ( "apply amplification: %f\n", time_spent_apply_amplification );
		}
		else
		{
			/* Unknown subchunk */
			printf ( "  Ignoring subchunk\n" );

			fread ( item, subchunk_size, 1, infile );
			fwrite ( item, subchunk_size, 1, outfile );													/* Write to new file */
		}

		// 3000 spots per array left and right 
		processed_bytes += subchunk_size;
	}
	printf ( "All done\n" );
	fclose ( infile );
	fclose ( outfile );
}