import { Router } from "express";
import tcoRouter from "./tco";
import timingRouter from "./timing";
import lifecycleStageRouter from "./lifecycleStage";

const v1 = Router();

v1.use("/tco", tcoRouter);
v1.use("/timing", timingRouter);
v1.use("/lifecycle", lifecycleStageRouter);

export default v1;
