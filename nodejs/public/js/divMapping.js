/**
 * Created by Duke on 2019/5/19.
 */

const editDiv = {
    gasDiv: ` <div class="setting-gas-div" style="height: 140px;">
                        <div style="height: 50px;">
                            <div class="col-md-1" style="line-height: 40px">H2S(ppm)</div>
                            <div class="col-md-11">
                                <div >
                                    <div class="col-md-2">
                                        Ceiling
                                    </div>
                                    <div>
                                        <a>HiLiAL: </a><input id="g-h-c-p" type="number" placeholder="number only">
                                        <a>HiAL: </a><input id="g-h-c-r" type="number" placeholder="number only">
                                    </div>
                                </div>
                                <div style="margin-top: 2px" >
                                    <div class="col-md-2">
                                        Floor
                                    </div>
                                    <div>
                                        <a>LoLiAL: </a><input id="g-h-f-p" type="text" placeholder="number only">
                                        <a>LoAL: </a><input id="g-h-f-r" type="text" placeholder="number only">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="padding-top: 6px">
                            <div class="col-md-1" style="line-height: 40px">CH4(ppm)</div>
                             <div class="col-md-11" >
                                <div >
                                    <div class="col-md-2">
                                        Ceiling
                                    </div>
                                    <div>
                                        <a>HiLiAL: </a><input id="g-c-c-p" type="number" placeholder="number only">
                                        <a>HiAL: </a><input id="g-c-c-r" type="number" placeholder="number only">
                                    </div>
                                </div>
                                <div style="margin-top: 2px">
                                    <div class="col-md-2">
                                        Floor
                                    </div>
                                    <div>
                                        <a>LoLiAL: </a><input id="g-c-f-p" type="text" placeholder="number only">
                                        <a>LoAL: </a><input id="g-c-f-r" type="text" placeholder="number only">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
    `,
    liftDiv: `<div class="setting-lift-div">
                        <div class="lift-t-t">
                            Accelerometer(m/s2)
                        </div>
                        <div>
                            <div>
                                <div class="col-md-1" style="line-height: 40px">x</div>
                                <div class="col-md-11">
                                    <div >
                                    <div class="col-md-2">
                                        Ceiling
                                    </div>
                                    <div>
                                        <a>HiLiAL: </a><input id="l-ac-x-c-p" type="number" placeholder="number only">
                                        <a>HiAL: </a><input id="l-ac-x-c-r"  type="number" placeholder="number only">
                                    </div>
                                </div>
                                <div style="margin-top: 2px">
                                    <div class="col-md-2">
                                        Floor
                                    </div>
                                    <div>
                                        <a>LoLiAL: </a><input  id="l-ac-x-f-p" type="text" placeholder="number only">
                                        <a>LoAL: </a><input id="l-ac-x-f-r"  type="text" placeholder="number only">
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div style="margin-top: 4px">
                                <div class="col-md-1" style="line-height: 40px">y</div>
                                <div class="col-md-11">
                                   <div >
                                    <div class="col-md-2">
                                        Ceiling
                                    </div>
                                    <div>
                                        <a>HiLiAL: </a><input id="l-ac-y-c-p" type="number" placeholder="number only">
                                        <a>HiAL: </a><input id="l-ac-y-c-r" type="number" placeholder="number only">
                                    </div>
                                </div>
                                <div style="margin-top: 2px">
                                    <div class="col-md-2">
                                        Floor
                                    </div>
                                    <div>
                                        <a>LoLiAL: </a><input id="l-ac-y-f-p" type="text" placeholder="number only">
                                        <a>LoAL: </a><input id="l-ac-y-f-r" type="text" placeholder="number only">
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div style="margin-top: 4px">
                                <div class="col-md-1" style="line-height: 40px">z</div>
                                <div class="col-md-11">
                                    <div >
                                    <div class="col-md-2">
                                        Ceiling
                                    </div>
                                    <div>
                                        <a>HiLiAL: </a><input id="l-ac-z-c-p" type="number" placeholder="number only">
                                        <a>HiAL: </a><input id="l-ac-z-c-r" type="number" placeholder="number only">
                                    </div>
                                </div>
                                <div style="margin-top: 2px">
                                    <div class="col-md-2">
                                        Floor
                                    </div>
                                    <div>
                                        <a>LoLiAL: </a><input id="l-ac-z-f-p" type="text" placeholder="number only">
                                        <a>LoAL: </a><input id="l-ac-z-f-r" type="text" placeholder="number only">
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>

                        <div class="lift-t-t">
                            Agular Volocity(°/s)
                        </div>
                        <div>
                            <div>
                                <div class="col-md-1" style="line-height: 40px">x</div>
                                <div class="col-md-11">
                                    <div >
                                    <div class="col-md-2">
                                        Ceiling
                                    </div>
                                    <div>
                                        <a>HiLiAL: </a><input id="l-au-x-c-p" type="number" placeholder="number only">
                                        <a>HiAL: </a><input id="l-au-x-c-r"  type="number" placeholder="number only">
                                    </div>
                                </div>
                                <div style="margin-top: 2px">
                                    <div class="col-md-2">
                                        Floor
                                    </div>
                                    <div>
                                        <a>LoLiAL: </a><input  id="l-au-x-f-p" type="text" placeholder="number only">
                                        <a>LoAL: </a><input id="l-au-x-f-r"  type="text" placeholder="number only">
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div style="margin-top: 4px">
                                <div class="col-md-1" style="line-height: 40px">y</div>
                                <div class="col-md-11">
                                   <div >
                                    <div class="col-md-2">
                                        Ceiling
                                    </div>
                                    <div>
                                        <a>HiLiAL: </a><input id="l-au-y-c-p" type="number" placeholder="number only">
                                        <a>HiAL: </a><input id="l-au-y-c-r" type="number" placeholder="number only">
                                    </div>
                                </div>
                                <div style="margin-top: 2px">
                                    <div class="col-md-2">
                                        Floor
                                    </div>
                                    <div>
                                        <a>LoLiAL: </a><input id="l-au-y-f-p" type="text" placeholder="number only">
                                        <a>LoAL: </a><input id="l-au-y-f-r" type="text" placeholder="number only">
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div style="margin-top: 4px">
                                <div class="col-md-1" style="line-height: 40px">z</div>
                                <div class="col-md-11">
                                    <div >
                                    <div class="col-md-2">
                                        Ceiling
                                    </div>
                                    <div>
                                        <a>HiLiAL: </a><input id="l-au-z-c-p" type="number" placeholder="number only">
                                        <a>HiAL: </a><input id="l-au-z-c-r" type="number" placeholder="number only">
                                    </div>
                                </div>
                                <div style="margin-top: 2px">
                                    <div class="col-md-2">
                                        Floor
                                    </div>
                                    <div>
                                        <a>LoLiAL: </a><input id="l-au-z-f-p" type="text" placeholder="number only">
                                        <a>LoAL: </a><input id="l-au-z-f-r" type="text" placeholder="number only">
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div class="lift-t-t">
                            Inclination(°)
                        </div>
                        <div>
                            <div>
                                <div class="col-md-1" style="line-height: 40px">x</div>
                                <div class="col-md-11">
                                    <div >
                                    <div class="col-md-2">
                                        Ceiling
                                    </div>
                                    <div>
                                        <a>HiLiAL: </a><input id="l-in-x-c-p" type="number" placeholder="number only">
                                        <a>HiAL: </a><input id="l-in-x-c-r"  type="number" placeholder="number only">
                                    </div>
                                </div>
                                <div style="margin-top: 2px">
                                    <div class="col-md-2">
                                        Floor
                                    </div>
                                    <div>
                                        <a>LoLiAL: </a><input  id="l-in-x-f-p" type="text" placeholder="number only">
                                        <a>LoAL: </a><input id="l-in-x-f-r"  type="text" placeholder="number only">
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div style="margin-top: 4px">
                                <div class="col-md-1" style="line-height: 40px">y</div>
                                <div class="col-md-11">
                                   <div >
                                    <div class="col-md-2">
                                        Ceiling
                                    </div>
                                    <div>
                                        <a>HiLiAL: </a><input id="l-in-y-c-p" type="number" placeholder="number only">
                                        <a>HiAL: </a><input id="l-in-y-c-r" type="number" placeholder="number only">
                                    </div>
                                </div>
                                <div style="margin-top: 2px">
                                    <div class="col-md-2">
                                        Floor
                                    </div>
                                    <div>
                                        <a>LoLiAL: </a><input id="l-in-y-f-p" type="text" placeholder="number only">
                                        <a>LoAL: </a><input id="l-in-y-f-r" type="text" placeholder="number only">
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div style="margin-top: 4px;height:190px">
                                <div class="col-md-1" style="line-height: 40px">z</div>
                                <div class="col-md-11">
                                    <div >
                                    <div class="col-md-2">
                                        Ceiling
                                    </div>
                                    <div>
                                        <a>HiLiAL: </a><input id="l-in-z-c-p" type="number" placeholder="number only">
                                        <a>HiAL: </a><input id="l-in-z-c-r" type="number" placeholder="number only">
                                    </div>
                                </div>
                                <div style="margin-top: 2px">
                                    <div class="col-md-2">
                                        Floor
                                    </div>
                                    <div>
                                        <a>LoLiAL: </a><input id="l-in-z-f-p" type="text" placeholder="number only">
                                        <a>LoAL: </a><input id="l-in-z-f-r" type="text" placeholder="number only">
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
    `,
    flowDiv: `<div class="setting-flow-div">
        <div>
                                <div >
                                    <div class="col-md-2">
                                        Ceiling
                                    </div>
                                    <div>
                                        <a>HiLiAL: </a><input id="f-c-p" type="number" placeholder="number only">
                                        <a>HiAL: </a><input id="f-c-r" type="number" placeholder="number only">
                                    </div>
                                </div>
                                <div style="margin-top: 2px" >
                                    <div class="col-md-2">
                                        Floor
                                    </div>
                                    <div>
                                        <a>LoLiAL: </a><input id="f-f-p" type="text" placeholder="number only">
                                        <a>LoAL: </a><input id="f-f-r" type="text" placeholder="number only">
                                    </div>
                                </div>

        </div>
    `,
    time: `
     <div>
                            <h5 class="alarm-t">alarm time setting</h5>
                        </div>
                        <div>
                            <div class="col-md-2">
                            <a  style="width: 40px;">startTime: </a>
                            </div>
                            <input type="number" id="alarm-s-t-h" style="width: 150px;"max="24"   min="0" placeholder="hour"> :
                            <input type="number" id="alarm-s-t-m" style="width: 150px;" max="60" min="" placeholder="minute">
                        </div>

                        <div>
                             <div class="col-md-2">
                            <a  style="width: 40px;">endTime: </a>
                            </div> <input id="alarm-e-t-h"  style="width: 150px;" type="number" max="24"   min="0" placeholder="hour"> :
                            <input id="alarm-e-t-m" style="width: 150px;" type="number" max="60" min="" placeholder="minute">
                        </div>
                        `
}




