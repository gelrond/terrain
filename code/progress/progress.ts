// ********************************************************************************************************************
import { clamp, max, round } from "../helpers/math.helper";
import { IProgress } from "./progress.interface";
// ********************************************************************************************************************
export abstract class Progress implements IProgress {

    // ****************************************************************************************************************
    // increment - the increment
    // ****************************************************************************************************************
    private increment: number = 0;

    // ****************************************************************************************************************
    // index - the index
    // ****************************************************************************************************************
    private index: number = 0;

    // ****************************************************************************************************************
    // percentage - the percentage
    // ****************************************************************************************************************
    private percentage: number = 0;

    // ****************************************************************************************************************
    // step - the step
    // ****************************************************************************************************************
    private step: number = 0;

    // ****************************************************************************************************************
    // text - the text
    // ****************************************************************************************************************
    private text: string | null = null;

    // ****************************************************************************************************************
    // total - the total
    // ****************************************************************************************************************
    private total: number = 0;

    // ****************************************************************************************************************
    // constructor
    // ****************************************************************************************************************
    constructor() { }

    // ****************************************************************************************************************
    // function:    begin
    // ****************************************************************************************************************
    // parameters:  total - the total
    // ****************************************************************************************************************
    //              text - the text
    // ****************************************************************************************************************
    //              step - the step
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    public begin(total: number, text: string | null = null, step: number = 1): void {

        this.reset();

        this.total = max(1, total);

        this.increment = 100.0 / this.total;

        this.step = clamp(step, 1, 100);

        this.text = text;

        this.render(0, text);
    }

    // ****************************************************************************************************************
    // function:    next
    // ****************************************************************************************************************
    // parameters:  n/a
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    public next(): void {

        if (this.percentage < 100) {

            this.percentage += this.increment;

            const index = round(this.percentage);

            if (this.index != index) {

                this.index = index;

                if ((this.index % this.step) == 0) {

                    this.render(index, this.text);
                }
            }
        }
    }

    // ****************************************************************************************************************
    // function:    render
    // ****************************************************************************************************************
    // parameters:  percentage - the percentage
    // ****************************************************************************************************************
    //              text - the text
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    public abstract render(percentage: number, text: string | null): void;

    // ****************************************************************************************************************
    // function:    reset
    // ****************************************************************************************************************
    // parameters:  n/a
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    public reset(): void {

        this.increment = 0;

        this.index = 0;

        this.percentage = 0;

        this.step = 0;

        this.text = null;

        this.total = 0;
    }
}
