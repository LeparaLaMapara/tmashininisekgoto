---
title: Picking a Research Topic
date: 2024-10-10
tags: [mlops, systems, ai]
summary: Models don’t fail — systems do.
---

## Why research topics fail

Most ML failures have nothing to do with models.

They fail because of **system constraints**, not theory.

---

## Inline math

The bias–variance tradeoff is often written as  
$E[(y - \hat{y})^2] = \text{Bias}^2 + \text{Variance} + \sigma^2$

---

## Block equation

$
\mathcal{L}(\theta) = \sum_{i=1}^{N} (y_i - f_\theta(x_i))^2
$

---

## Code block (Python)

```python
def train(model, data):
    for x, y in data:
        loss = model(x).loss(y)
        loss.backward()
```

## References

1. Sutton & Barto, *Reinforcement Learning*
2. Goodfellow et al., *Deep Learning*
3. Bishop, *Pattern Recognition and ML*
