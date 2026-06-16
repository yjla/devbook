# V8引擎



## 工作原理

1. 解析：
   1. 词法分析（Tokenizing/Lexing）：Scanner 模块负责扫描源代码，将 Unicode Stream 字符流分解成词法单元（token）。
   2. 语法分析： 分析语法错误，确定词法作用域，将 token 转换为抽象语法树（AST）
      - 完全解析：使用解析器（Parser）解析所有立即执行的代码，包括语法检查，会生成 AST
      - 惰性解析：使用预解析器（Pre-Parser）解析未被立即执行的代码，不生成 AST 
2. 即时编译（JIT）：
   - 解释执行：解释器（Ignition）将 AST 转换为字节码，创建执行上下文，一边解释一边执行。解释器同时会记录某一代码片段的执行次数，如果执行次数超过了某个阈值，这段代码便会被标记为热代码（Hot Code）
   - 编译执行：编译器（TurboFan）会优化并编译热代码的字节码，生成优化的机器码，进行编译执行



## 参考

1. [教女朋友学前端之深入理解JS引擎 - 掘金](https://juejin.cn/post/6996825009280778253)
2. [从javascript代码解析过程理解执行上下文与作用域提升_hello ice cream-CSDN博客](https://blog.csdn.net/bingbing1128/article/details/120591516)