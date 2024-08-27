# Introduction to Artificial Intelligence
# MNIST dataset
# Deep Neural Network

import math
import numpy as np
import pandas as pd
import pickle
import tensorflow as tf
import sklearn.preprocessing
import time
import matplotlib.pyplot as plt

#
# Load and prepare data
#

# Load the training and test data from the Pickle file
with open("mnist_dataset.pickle", "rb") as f:
      train_data, train_labels, test_data, test_labels = pickle.load(f)

# Scale pixels to range 0-1.0
maxval = train_data.max()
train_data = train_data / maxval
test_data = test_data / maxval

# One-hot encode the labels
train_labels_onehot = tf.keras.utils.to_categorical(train_labels)
test_labels_onehot = tf.keras.utils.to_categorical(test_labels)
num_classes = test_labels_onehot.shape[1]

# Get some lengths
n_inputs = train_data.shape[1]
nsamples = train_data.shape[0]

# Training constants
n_nodes = 500
n_layers = 5
batch_size = 32
n_epochs = 200
eval_step = 10
learning_rate = 3e-5

# Print configuration summary
n_nodes_per_layer = n_nodes // n_layers
print("Num nodes: {} Num layers: {} Nodes per layer: {}".format(n_nodes, n_layers, n_nodes_per_layer))
n_batches = math.ceil(nsamples / batch_size)
print("Batch size: {} Num batches: {} Num epochs: {}".format(batch_size, n_batches, n_epochs))

#
# Keras definitions
#

# Create a neural network model
model = tf.keras.models.Sequential()

# Layer 1 (specify input size)
#   Inputs: n_inputs
#   Outputs: n_nodes_per_layer
#   Activation: ELU
model.add(tf.keras.layers.Dense(
        n_nodes_per_layer,
        input_shape=(n_inputs,),
        activation='elu',
        kernel_initializer='he_normal', bias_initializer='zeros'))
print("Layer 1: Num nodes={}  Activation=ELU".format(n_nodes_per_layer))

# Other hidden layers
#   Inputs: n_nodes_per_layer
#   Outputs: n_nodes_per_layer
#   Activation: ELU
for n in range(2, n_layers+1):
    model.add(tf.keras.layers.Dense(
            n_nodes_per_layer,
            activation='elu',
            kernel_initializer='he_normal', bias_initializer='zeros'))
    print("Layer {}: Num nodes={}  Activation=ELU".format(n, n_nodes_per_layer))

# Output layer:
#   Inputs: n_nodes_per_layer
#   Outputs: num_classes
#   Activation: softmax
model.add(tf.keras.layers.Dense(
        num_classes,
        activation='softmax',
        kernel_initializer='glorot_normal', bias_initializer='zeros'))
print("Output Layer: Num nodes={}  Activation=Softmax".format(num_classes))

# Define the optimizer

# ADAM optimizer
optimizer = tf.keras.optimizers.Adam(learning_rate=learning_rate)
print("Optimizer: ADAM.  Learning rate = {}".format(learning_rate))

# Define model
model.compile(
        optimizer=optimizer,
        loss='categorical_crossentropy',
        metrics=['accuracy']
        )

# Train the neural network
start_time = time.time()
history = model.fit(
        train_data,
        train_labels_onehot,
        epochs=n_epochs,
        batch_size=batch_size,
        validation_data=(test_data, test_labels_onehot),
        validation_freq=eval_step,
        verbose=2,
        )
elapsed_time = time.time() - start_time
print("Execution time: {:.1f}".format(elapsed_time))

cost_test, acc_test = model.evaluate(test_data, test_labels_onehot, batch_size=None, verbose=0)
cost_train, acc_train = model.evaluate(train_data, train_labels_onehot, batch_size=None, verbose=0)

print("Final Test Accuracy:     {:.4f}".format(acc_test))
print("Final Training Cost:     {:.8f}".format(cost_train))

# Compute the best test result from the history
epoch_hist = [i for i in range(0, n_epochs, eval_step)]
test_acc_hist = history.history['val_accuracy']
test_best_val = max(test_acc_hist)
test_best_idx = test_acc_hist.index(test_best_val)
print("Best Test Accuracy:      {:.4f} at epoch: {}".format(test_best_val, epoch_hist[test_best_idx]))

# Plot the history of the loss
plt.plot(history.history['loss'])
plt.title('Training Cost')
plt.ylabel('Cost')
plt.xlabel('Epoch')

# Plot the history of the test accuracy
plt.figure()
plt.plot(epoch_hist, history.history['val_accuracy'], "r")
plt.title('Test Accuracy')
plt.ylabel('Accuracy')
plt.xlabel('Epoch')
plt.show()

