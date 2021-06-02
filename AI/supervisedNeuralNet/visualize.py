import tensorflow as tf
from tensorflow.keras.utils import plot_model

model = tf.keras.models.load_model('AI\supervisedNeuralNet\model.h5')
model.compile(optimizer='adam', loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True), metrics=['accuracy'])

plot_model(model, to_file='AI\supervisedNeuralNet\model_vis.png')