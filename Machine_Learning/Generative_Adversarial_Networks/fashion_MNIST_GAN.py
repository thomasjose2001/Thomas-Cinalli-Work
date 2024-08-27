# Thomas Cinalli
# Introduction to Artifical Intelligence
# Fashion MNIST

import math
import numpy as np
import pandas as pd
import pickle
import tensorflow as tf
import sklearn.preprocessing
import time
import matplotlib.pyplot as plt


# Load from Pickle file
with open("mnist_fashion_dataset.pickle", "rb") as f:
      train_data, train_labels, test_data, test_labels = pickle.load(f)

# Scale pixels to range 0-1.0
maxval = train_data.max()
train_data = train_data / maxval
test_data = test_data / maxval

# Lengths
nPixels = train_data.shape[1]
nSamples = train_data.shape[0]
   
# Discriminator network
discriminator = tf.keras.models.Sequential()
discriminator.add(tf.keras.layers.Dense(1024, input_shape=(nPixels,), activation='elu', kernel_initializer='he_normal', bias_initializer='zeros'))
discriminator.add(tf.keras.layers.Dropout(0.3))
discriminator.add(tf.keras.layers.Dense(512, activation='elu', kernel_initializer='he_normal', bias_initializer='zeros'))
discriminator.add(tf.keras.layers.Dropout(0.3))
discriminator.add(tf.keras.layers.Dense(256, activation='elu', kernel_initializer='he_normal', bias_initializer='zeros'))
discriminator.add(tf.keras.layers.Dropout(0.2))
discriminator.add(tf.keras.layers.Dense(1, activation='sigmoid', kernel_initializer='glorot_normal', bias_initializer='zeros'))

# Generator network
n_inputs_generator = 100
generator = tf.keras.models.Sequential()
generator.add(tf.keras.layers.Dense(256, input_shape=(n_inputs_generator,), activation='elu', kernel_initializer='he_normal', bias_initializer='zeros'))
generator.add(tf.keras.layers.Dense(512, activation='elu', kernel_initializer='he_normal', bias_initializer='zeros'))
generator.add(tf.keras.layers.Dense(1024, activation='elu', kernel_initializer='he_normal', bias_initializer='zeros'))
generator.add(tf.keras.layers.Dense(nPixels, activation='sigmoid', kernel_initializer='glorot_normal', bias_initializer='zeros'))

# GAN
GAN = tf.keras.models.Sequential([generator, discriminator])

# Data accessors
def get_real_samples(how_many):
    selected_indices = np.random.randint(0, nSamples, how_many)
    selected_data = train_data[selected_indices]
    real_labels = np.ones((how_many, 1))
    return selected_data, real_labels

def get_random_inputs_for_generator(how_many):
    rand_values = np.random.randn(n_inputs_generator * how_many)
    gen_input = rand_values.reshape(how_many, n_inputs_generator)
    return gen_input

def get_fake_samples_2(how_many):
    rand_values = get_random_inputs_for_generator(how_many)
    gen_data = generator.predict(rand_values, batch_size=None, verbose=0)
    fake_labels = np.zeros((how_many, 1))
    return gen_data, fake_labels

def get_data_for_discriminator_2(how_many):
    # Get 50% of the batch from real data
    real_data, real_labels = get_real_samples(how_many//2)
    fake_data, fake_labels = get_fake_samples_2(how_many-(how_many//2))
    # Concatenate
    data = np.concatenate((real_data, fake_data))
    labels = np.concatenate((real_labels, fake_labels))
    # Shuffle
    shuffle_order = np.random.default_rng().permutation(how_many)
    data = data[shuffle_order]
    labels = labels[shuffle_order]
    return data, labels


# Train the system
batch_size = 128
nIterationsDis = 30
nIterationsGen = 40
learningRateDis = 0.0001
learningRateGen = 0.00001
nRepetitions = 500
printStep = 50

discriminator.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=learningRateDis),
        loss='binary_crossentropy',
        metrics='accuracy' 
        )

GAN.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=learningRateGen),
        loss='binary_crossentropy',
        metrics='accuracy' 
        )

for repetition in range(nRepetitions):
    # Train the discriminator
    # Record initial accuracy of discriminator
    batch_data, batch_labels = get_data_for_discriminator_2(batch_size)
    _, discr_init_acc = discriminator.evaluate(batch_data, batch_labels, verbose=0)

    # Train the discriminator for a number of iterations    
    for iteration in range(nIterationsDis):
        batch_data, batch_labels = get_data_for_discriminator_2(batch_size)
        trn_loss, trn_acc = discriminator.train_on_batch(batch_data, batch_labels)
        #print("Iteration {:2d}: Cost: {:.4f} Accuracy: {:.3f}".format(iteration, trn_loss, trn_acc))

    # Record final accuracy of discriminator
    discr_end_acc = trn_acc

    # Train the generator
    # Record initial accuracy of generator
    rand_inputs = get_random_inputs_for_generator(batch_size)
    desired_labels = np.ones((batch_size, 1))
    _, gen_init_acc = GAN.evaluate(rand_inputs, desired_labels, verbose=0)
    
    # Train the generator for a number of iterations
    discriminator.trainable = False
    for iteration in range(nIterationsGen):
        rand_inputs = get_random_inputs_for_generator(batch_size)
        desired_labels = np.ones((batch_size, 1))
        trn_loss, trn_acc = GAN.train_on_batch(rand_inputs, desired_labels)
        #print("Iteration {:2d}: Cost: {:.4f} Accuracy: {:.3f}".format(iteration, trn_loss, trn_acc))
    discriminator.trainable = True

    # Record final accuracy of generator
    gen_end_acc = trn_acc

    # Print stats of repetition
    print("Repetition {:2d}:  Discriminator: {:.2f}->{:.2f}  Generator: {:.2f}->{:.2f}".format(repetition, discr_init_acc, discr_end_acc, gen_init_acc, gen_end_acc))

    if (repetition % printStep == (printStep-1)):
        # Generate 25 random images
        v = get_random_inputs_for_generator(25)
        generated_vectors = generator.predict(v, batch_size=None, verbose=0)
        for idx in range(25):
            plt.subplot(5,5,idx+1);
            image = generated_vectors[idx].reshape(28,28)
            plt.imshow(image, cmap="gray_r")
        plt.show()

