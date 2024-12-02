const Sequence = require('../Models/Sequence'); // Path to your Sequence model

async function getNextSequence(name) {
  const sequence = await Sequence.findOneAndUpdate(
    { name },
    { $inc: { sequenceValue: 1 } }, // Increment the sequence value by 1
    { new: true, upsert: true }     // Create the sequence document if it doesn't exist
  );
  return sequence.sequenceValue;
}
module.exports = {getNextSequence};